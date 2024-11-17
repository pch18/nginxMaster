package pkg

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func ListCert() (list []map[string]any, err error) {
	list = []map[string]any{}
	// 读取目录下的所有文件
	files, err := os.ReadDir(CertDir)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		// 检查文件是否以 .json 结尾
		if filepath.Ext(file.Name()) == ".json" {
			filePath := filepath.Join(CertDir, file.Name())
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

func PathCert(id string) (certPemPath, certKeyPath, certConfigPath string) {
	certPemPath = fmt.Sprintf("%s/%s.pem", CertDir, id)
	certKeyPath = fmt.Sprintf("%s/%s.key", CertDir, id)
	certConfigPath = fmt.Sprintf("%s/%s.json", CertDir, id)
	return
}

func SaveCert(id string, certConfig any, certPemRaw, certKeyRaw string) (output string, err error) {
	certPemPath, certKeyPath, certConfigPath := PathCert(id)

	certPemBak, certPemBakErr := os.ReadFile(certPemPath)
	certKeyBak, certKeyBakErr := os.ReadFile(certKeyPath)
	certConfigBak, certConfigBakErr := os.ReadFile(certConfigPath)

	var done = false
	defer func() {
		if !done {
			if certPemBakErr == nil {
				WriteFile(certPemPath, certPemBak)
			} else if os.IsNotExist(certPemBakErr) {
				os.Remove(certPemPath)
			}
			if certKeyBakErr == nil {
				WriteFile(certKeyPath, certKeyBak)
			} else if os.IsNotExist(certKeyBakErr) {
				os.Remove(certKeyPath)
			}
			if certConfigBakErr == nil {
				WriteFile(certConfigPath, certConfigBak)
			} else if os.IsNotExist(certConfigBakErr) {
				os.Remove(certConfigPath)
			}
		}
	}()

	if certConfig != nil {
		var certConfigJSON []byte
		certConfigJSON, err = json.MarshalIndent(certConfig, "", "\t")
		if err != nil {
			output = "marshal certConfig failed"
			return
		}
		err = WriteFile(certConfigPath, certConfigJSON)
		if err != nil {
			output = "write certConfigJSON failed, path: " + certConfigPath
			return
		}
		err = WriteFile(certPemPath, []byte(certPemRaw))
		if err != nil {
			output = "write certPemRaw failed, path: " + certPemPath
			return
		}
		err = WriteFile(certKeyPath, []byte(certKeyRaw))
		if err != nil {
			output = "write certKeyRaw failed, path: " + certKeyPath
			return
		}
	} else {
		err = os.Remove(certConfigPath)
		if err != nil && !os.IsNotExist(err) {
			output = "remove certConfigJSON failed, path: " + certConfigPath
			return
		}
		err = os.Remove(certPemPath)
		if err != nil && !os.IsNotExist(err) {
			output = "remove certPemRaw failed, path: " + certPemPath
			return
		}
		err = os.Remove(certKeyPath)
		if err != nil && !os.IsNotExist(err) {
			output = "remove certKeyRaw failed, path: " + certKeyPath
			return
		}
	}

	output, err = NginxReload()
	if err != nil {
		return
	}

	done = true
	return
}
