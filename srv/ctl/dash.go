package ctl

import (
	"log"
	"net/http"
	"nginx_master/pkg"
	"os"
	"strconv"

	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
)

const LogFileHistoryLines = 100

func NginxLogs(c *gin.Context) {
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		c.AbortWithStatus(500)
		return
	}
	defer watcher.Close()

	err = watcher.Add(pkg.NginxLogFile)
	if err != nil {
		c.AbortWithStatus(500)
		return
	}

	file, err := os.Open(pkg.NginxLogFile)
	if err != nil {
		c.AbortWithStatus(500)
		return
	}
	defer file.Close()

	var lines []string
	var pos int64
	lastCur := c.GetHeader("last-event-id")
	if lastCur != "" {
		pos, err = strconv.ParseInt(lastCur, 10, 0)
		if err != nil {
			c.AbortWithStatus(500)
			return
		}
		lines, pos, _ = pkg.ReadLinesStartPos(file, pos)
	} else {
		lines, pos, _ = pkg.ReadLastNLines(file, LogFileHistoryLines)
	}

	for _, line := range lines {
		c.Writer.WriteString("data: ")
		c.Writer.WriteString(line)
		c.Writer.WriteString("\n\n")
	}
	c.Writer.WriteString("id: ")
	c.Writer.WriteString(strconv.FormatInt(pos, 10))
	c.Writer.WriteString("\n\n")
	c.Writer.Flush()

	defer func() {
		log.Println("NginxLogs disconnected")
	}()

	for {
		select {
		case <-c.Request.Context().Done():
			return
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			if event.Op&fsnotify.Write == fsnotify.Write {
				lines, pos, _ = pkg.ReadLinesStartPos(file, pos)
				for _, line := range lines {
					c.Writer.WriteString("data: ")
					c.Writer.WriteString(line)
					c.Writer.WriteString("\n\n")
				}
				c.Writer.WriteString("id: ")
				c.Writer.WriteString(strconv.FormatInt(pos, 10))
				c.Writer.WriteString("\n\n")
				c.Writer.Flush()
			}
		case _, ok := <-watcher.Errors:
			if !ok {
				return
			}
		}
	}
}

func NginxStatus(c *gin.Context) {
	ok, err := pkg.NginxStatus()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"err": err.Error(),
			"ok":  ok,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"ok": ok,
	})
}

func NginxStart(c *gin.Context) {
	output, err := pkg.NginxStart()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"err":    "NginxStart Failed",
			"output": output,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"output": output,
	})
}
