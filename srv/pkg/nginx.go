package pkg

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
)

func NginxReload() (string, error) {
	// 创建一个 exec.Command 来执行 nginx -s reload 命令
	cmd := exec.Command(NginxBin, "-s", "reload")

	// 使用 CombinedOutput 方法来运行命令，并获取输出和错误信息
	output, err := cmd.CombinedOutput()
	if err != nil {
		return string(output), fmt.Errorf("failed to reload nginx: %w", err)
	}

	return string(output), nil
}

func NginxVerify(config string) (string, error) {
	// 创建临时文件
	nginxTempFile, err := os.CreateTemp("", "nginx-*.conf")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer nginxTempFile.Close() // 确保函数结束时删除临时文件

	nginxRootFile, err := os.Open(NginxRootFile)
	if err != nil {
		return "", fmt.Errorf("failed to open nginxRootFile: %w", err)
	}
	defer nginxRootFile.Close()

	reader := bufio.NewReader(nginxRootFile)
	writer := bufio.NewWriter(nginxTempFile)
	for {
		line, readErr := reader.ReadString('\n')
		if readErr != nil && readErr != io.EOF {
			return "", fmt.Errorf("failed to read nginxRootFile: %w", err)
		}

		if strings.Contains(line, "#@VERIFY_REPLACE_LINE@#") {
			line = config + "\n"
		}

		_, writeErr := writer.WriteString(line)
		if writeErr != nil {
			return "", fmt.Errorf("failed to write nginxTempFile: %w", err)
		}

		if readErr == io.EOF {
			break
		}
	}
	writer.Flush()

	// 创建一个 exec.Command 来执行 nginx -t -c 命令
	cmd := exec.Command(NginxBin, "-t", "-c", nginxTempFile.Name())

	// 使用 CombinedOutput 方法来运行命令，并获取输出和错误信息
	output, err := cmd.CombinedOutput()
	if err != nil {
		return string(output), fmt.Errorf("failed to verify nginx config: %w", err)
	}

	return string(output), nil
}
