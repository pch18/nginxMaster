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

	var pos int64
	lastCur := c.GetHeader("last-event-id")
	if lastCur != "" {
		pos, err = strconv.ParseInt(lastCur, 10, 0)
		if err != nil {
			c.AbortWithStatus(500)
			return
		}
		pos = pkg.ReadLinesAfterPos(c.Request.Context(), file, pos, 10000, func(l []byte, p int64) {
			c.Writer.WriteString("id: ")
			c.Writer.WriteString(strconv.FormatInt(p, 10))
			c.Writer.Write([]byte{'\n'})

			c.Writer.WriteString("data: ")
			c.Writer.WriteString(strconv.FormatInt(p, 10))
			c.Writer.Write([]byte{'"'})
			c.Writer.Write(l)
			c.Writer.Write([]byte{'\n'})
			c.Writer.Write([]byte{'\n'})
			c.Writer.Flush()
		})

	} else {
		lineCount := nginxLogHistoryDefaultLines
		lineCountStr := c.Query("n")
		if lineCountStr != "" {
			lineCount, err = strconv.ParseInt(lineCountStr, 10, 0)
			if err != nil {
				c.AbortWithStatus(500)
				return
			}
			if lineCount > nginxLogHistoryMaxLines {
				lineCount = nginxLogHistoryMaxLines
			}
		}

		fileInfo, err := file.Stat()
		if err != nil {
			c.AbortWithStatus(500)
			return
		}
		pos = pkg.SeekBackToLastLine(file, fileInfo.Size()-1)

		c.Writer.WriteString("id: ")
		c.Writer.WriteString(strconv.FormatInt(pos, 10))
		c.Writer.Write([]byte{'\n'})
		c.Writer.Write([]byte{'\n'})
		c.Writer.Flush()

		pkg.ReadLinesBeforePos(c.Request.Context(), file, pos, lineCount, func(l []byte, p int64) {
			c.Writer.WriteString("data: ")
			c.Writer.Write([]byte{'@'})
			c.Writer.WriteString(strconv.FormatInt(p, 10))
			c.Writer.Write([]byte{'"'})
			c.Writer.Write(l)
			c.Writer.Write([]byte{'\n'})
			c.Writer.Write([]byte{'\n'})
			c.Writer.Flush()
		})
	}

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
				pos = pkg.ReadLinesAfterPos(c.Request.Context(), file, pos, 10000, func(l []byte, p int64) {
					c.Writer.WriteString("id: ")
					c.Writer.WriteString(strconv.FormatInt(p, 10))
					c.Writer.Write([]byte{'\n'})
					c.Writer.WriteString("data: ")
					c.Writer.WriteString(strconv.FormatInt(p, 10))
					c.Writer.Write([]byte{'"'})
					c.Writer.Write(l)
					c.Writer.Write([]byte{'\n'})
					c.Writer.Write([]byte{'\n'})
					c.Writer.Flush()
				})
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

func NginxReload(c *gin.Context) {
	output, err := pkg.NginxReload()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"err":    "NginxReload Failed",
			"output": output,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"output": output,
	})
}
