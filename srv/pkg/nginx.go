package pkg

import (
	"fmt"
	"os"
	"os/exec"
)

func NginxReload() (string, error) {
	// 创建一个 exec.Command 来执行 nginx -s reload 命令
	cmd := exec.Command(NginxBin, "-s", "reload", "-c", NginxConfigPath)

	// 使用 CombinedOutput 方法来运行命令，并获取输出和错误信息
	output, err := cmd.CombinedOutput()
	if err != nil {
		return string(output), fmt.Errorf("failed to reload nginx: %w", err)
	}

	return string(output), nil
}

func NginxVerify(config string) (string, error) {
	// 创建临时文件
	tmpfile, err := os.CreateTemp("", "nginx-*.conf")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpfile.Name()) // 确保函数结束时删除临时文件

	config = fmt.Sprintf("events{}\nhttp{\n%s\n}", config)
	fmt.Println(config)
	// 写入配置内容到临时文件
	if _, err := tmpfile.Write([]byte(config)); err != nil {
		return "", fmt.Errorf("failed to write to temp file: %w", err)
	}
	if err := tmpfile.Close(); err != nil {
		return "", fmt.Errorf("failed to close temp file: %w", err)
	}

	// 创建一个 exec.Command 来执行 nginx -t -c 命令
	cmd := exec.Command(NginxBin, "-t", "-c", tmpfile.Name())

	// 使用 CombinedOutput 方法来运行命令，并获取输出和错误信息
	output, err := cmd.CombinedOutput()
	if err != nil {
		return string(output), fmt.Errorf("failed to verify nginx config: %w", err)
	}

	return string(output), nil
}
