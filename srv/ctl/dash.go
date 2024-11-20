package ctl

import (
	"log"
	"nginx_master/pkg"
	"os"

	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
)

const LogFileHistoryLines = 3

func NginxLogs(c *gin.Context) {
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		c.Status(500)
		c.Abort()
		return
	}
	defer watcher.Close()

	err = watcher.Add(pkg.NginxLogFile)
	if err != nil {
		c.Status(500)
		c.Abort()
		return
	}

	file, err := os.Open(pkg.NginxLogFile)
	if err != nil {
		c.Status(500)
		c.Abort()
		return
	}
	defer file.Close()

	lines, pos, _ := pkg.ReadLastNLines(file, LogFileHistoryLines)
	for _, line := range lines {
		c.Writer.WriteString("data: ")
		c.Writer.WriteString(line)
		c.Writer.WriteString("\n")
	}
	c.Writer.Flush()

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			if event.Op&fsnotify.Write == fsnotify.Write {
				lines, pos, _ = pkg.ReadStartPos(file, pos)
				for _, line := range lines {
					c.Writer.WriteString("data: ")
					c.Writer.WriteString(line)
					c.Writer.WriteString("\n")
				}
				c.Writer.Flush()
			}
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			log.Println("error:", err)
		}
	}
}

func NginxStatus(c *gin.Context) {
}

func NginxStart(c *gin.Context) {
}
