package pkg

import "os"

func getCfgBase() string {
	if cfg := os.Getenv("NGINX_MASTER_BASE"); cfg != "" {
		return cfg
	}
	return "/nginx_master_data"
}

var (
	NginxBin = "nginx"
	CfgBase  = getCfgBase()

	// CfgBase = "/Users/pch18/Codes/github/nginxMaster/cfg" // 本地测试

	AuthFile        = CfgBase + "/auth"
	ServerConfigDir = CfgBase + "/servers"
	CertDir         = CfgBase + "/certs"

	NginxConfigDir     = CfgBase + "/servers"    // 发布环境
	NginxAccessLogFile = CfgBase + "/access.log" // 发布环境
	NginxErrorLogFile  = CfgBase + "/error.log"  // 发布环境
	NginxConfFile      = CfgBase + "/nginx.conf" // 发布环境
	NginxPidFile       = CfgBase + "/nginx.pid"    // 发布环境

// NginxConfigDir = "/opt/homebrew/etc/nginx/servers"                   // 本地测试
// NginxConfFile  = "/opt/homebrew/etc/nginx/nginx.conf"                // 本地测试
// NginxLogFile   = "/opt/homebrew/Cellar/nginx/1.27.2/logs/access.log" // 本地测试
// NginxPidFile   = "/opt/homebrew/var/run/nginx.pid"                   // 本地测试
)
