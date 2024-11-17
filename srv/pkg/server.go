package pkg

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func ListServer() (list []map[string]any, err error) {
	list = []map[string]any{}
	// 读取目录下的所有文件
	files, err := os.ReadDir(ServerConfigDir)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		// 检查文件是否以 .json 结尾
		if filepath.Ext(file.Name()) == ".json" {
			filePath := filepath.Join(ServerConfigDir, file.Name())
			fileData, err := os.ReadFile(filePath)
			if err != nil {
				continue
			}

			// 解析 JSON 文件
			var config map[string]interface{}
			err = json.Unmarshal(fileData, &config)
			if err != nil {
				continue
			}

			// 将解析后的 map 添加到数组中
			list = append(list, config)
		}
	}

	return
}

func SaveServer(id string, serverConfig any, nginxConfig string) (string, error) {
	var serverConfigPath = fmt.Sprintf("%s/%s.json", ServerConfigDir, id)
	var nginxConfigPath = fmt.Sprintf("%s/%s.conf", NginxConfigDir, id)

	serverConfigBak, serverConfigBakErr := os.ReadFile(serverConfigPath)
	nginxConfigBak, nginxConfigBakErr := os.ReadFile(nginxConfigPath)

	var done = false
	defer func() {
		if !done {
			if serverConfigBakErr == nil {
				WriteFile(serverConfigPath, serverConfigBak)
			} else if os.IsNotExist(serverConfigBakErr) {
				os.Remove(serverConfigPath)
			}
			if nginxConfigBakErr == nil {
				WriteFile(nginxConfigPath, nginxConfigBak)
			} else if os.IsNotExist(nginxConfigBakErr) {
				os.Remove(nginxConfigPath)
			}
		}
	}()

	if serverConfig != nil {
		serverConfigJSON, err := json.MarshalIndent(serverConfig, "", "\t")
		if err != nil {
			return "marshal serverConfig failed", err
		}
		err = WriteFile(serverConfigPath, serverConfigJSON)
		if err != nil {
			return "write serverConfig failed, path: " + serverConfigPath, err
		}
	}

	if nginxConfig != "" {
		err := WriteFile(nginxConfigPath, []byte(nginxConfig))
		if err != nil {
			return "write nginxConfig failed, path: " + nginxConfigPath, err
		}
	}

	if nginxConfig == "" || serverConfig == nil {
		err := os.Remove(nginxConfigPath)
		if err != nil && !os.IsNotExist(err) {
			return "remove nginxConfig failed, path: " + nginxConfigPath, err
		}
	}
	if serverConfig == nil {
		err := os.Remove(serverConfigPath)
		if err != nil && !os.IsNotExist(err) {
			return "remove serverConfig failed, path: " + serverConfigPath, err
		}
	}

	output, err := NginxReload()
	if err != nil {
		return output, err
	}

	done = true
	return output, nil
}
