package pkg

import (
	"fmt"
	"io"
	"os"
)

func WriteFile(path string, content []byte) error {
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	// 将字符串写入文件
	_, err = file.Write(content)
	if err != nil {
		return err
	}
	return nil
}

func ReadLastNLines(file *os.File, n int) (lines []string, fileSize int64, err error) {
	fileInfo, err := file.Stat()
	if err != nil {
		return
	}
	fileSize = fileInfo.Size()

	char := make([]byte, 1)
	pos := fileSize - 1
	var line []byte

	for {
		_, err = file.Seek(pos, io.SeekStart)
		if err == nil {
			_, err = file.Read(char)
		}
		if char[0] == '\n' || err != nil {
			fmt.Println(fileSize, pos)
			if len(line) != 0 {
				fmt.Println("new line", string(line))
				lines = append([]string{string(line)}, lines...)
			}
			line = nil
			if err != nil || len(lines) == n {
				fmt.Println("end lines", lines)
				return
			}
		} else {
			line = append([]byte{char[0]}, line...)
			fmt.Println("new char", string(char[0]))
		}
		pos--
	}
}

func ReadStartPos(file *os.File, startPos int64) (lines []string, endPos int64, err error) {
	char := make([]byte, 1)
	var line []byte
	pos := startPos

	for {
		_, err = file.Seek(pos, io.SeekStart)
		if err == nil {
			_, err = file.Read(char)
		}
		if err != nil {
			return
		}
		pos++

		if char[0] == '\n' {
			if len(line) != 0 {
				lines = append(lines, string(line))
				endPos = pos
			}
			line = nil
		} else {
			line = append(line, char[0])
		}
	}
}
