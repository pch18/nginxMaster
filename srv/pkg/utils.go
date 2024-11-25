package pkg

import (
	"context"
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

// 从指定位置，读取到最后一个 \n 为止, 剩余没有 \n 的部分，留着之后读取
func ReadLinesAfterPos(ctx context.Context, file *os.File, startPos int64, lineCount int64, onNewLine func(l []byte, p int64)) (endPos int64) {
	var err error
	char := make([]byte, 1)
	var line []byte
	pos := startPos
	endPos = pos
	readLineCount := int64(0)

	for {
		select {
		case <-ctx.Done():
			return
		default:
			pos++

			_, err = file.Seek(pos, io.SeekStart)
			if err == nil {
				_, err = file.Read(char)
			}

			// After 是读取到结束为止，立刻终止，丢弃最后一个换行符之后的部分
			if err != nil {
				return
			}

			// 下一行的首字符
			if char[0] == '\n' {
				endPos = pos
				if len(line) != 0 {
					onNewLine(line, pos)
					readLineCount++
					if readLineCount >= lineCount {
						return
					}
				}
				line = nil
			} else {
				line = append(line, char[0])
			}
		}
	}
}

func SeekBackToLastLine(file *os.File, startPos int64) (endPos int64) {
	var err error
	char := make([]byte, 1)
	pos := startPos

	for {
		_, err = file.Seek(pos, io.SeekStart)
		if err == nil {
			_, err = file.Read(char)
		}
		if char[0] == '\n' || err != nil {
			return pos
		}
		pos--
	}
}

// 读取最后 N 行, 和上一个不一样是：endPos 是上一个最近换行符，并且丢弃到上一个换行符之间的内容
func ReadLinesBeforePos(ctx context.Context, file *os.File, startPos int64, lineCount int64, onNewLine func(l []byte, p int64)) {
	var err error
	char := make([]byte, 1)
	var line []byte
	pos := startPos
	readLineCount := int64(0)

	for {
		select {
		case <-ctx.Done():
			return
		default:
			pos--

			_, err = file.Seek(pos, io.SeekStart)
			if err == nil {
				_, err = file.Read(char)
			}

			if char[0] == '\n' || err != nil {
				if len(line) != 0 {
					reverseBytes(line)
					onNewLine(line, pos)
					readLineCount++
					if readLineCount >= lineCount {
						return
					}
				}
				line = nil

				if err != nil {
					return
				}

			} else {
				line = append(line, char[0])
			}
		}
	}
}

func reverseBytes(original []byte) {
	for i, j := 0, len(original)-1; i < j; i, j = i+1, j-1 {
		original[i], original[j] = original[j], original[i]
	}
}
