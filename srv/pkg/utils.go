package pkg

import (
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
