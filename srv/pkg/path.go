package pkg

const (
	NginxBin = "nginx"
	WebDir   = "/nginx_master_web"
	// WebDir = "/Users/pch18/Codes/github/nginxMaster/web/dist"

	CfgBase = "/nginx_master" // 发布环境
	// CfgBase = "/Users/pch18/Codes/github/nginxMaster/cfg" // 本地测试

	AuthFile        = CfgBase + "/auth"
	ServerConfigDir = CfgBase + "/servers"
	CertDir         = CfgBase + "/certs"

	NginxConfigDir = CfgBase + "/servers"     // 发布环境
	NginxRootFile  = "/etc/nginx/nginx.conf"  // 发布环境
	NginxLogFile   = "/nginx_logs/access.log" // 发布环境
	NginxPidFile   = "/var/run/nginx.pid"     // 发布环境

// NginxConfigDir = "/opt/homebrew/etc/nginx/servers"                   // 本地测试
// NginxRootFile  = "/opt/homebrew/etc/nginx/nginx.conf"                // 本地测试
// NginxLogFile   = "/opt/homebrew/Cellar/nginx/1.27.2/logs/access.log" // 本地测试
// NginxPidFile   = "/opt/homebrew/var/run/nginx.pid"                   // 本地测试
)
