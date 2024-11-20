package pkg

const (
	NginxBin = "nginx"
	WebDir   = "/nginx_master_web"

	CfgBase = "/nginx_master"
	// CfgBase         = "/Users/pch18/Codes/github/nginxMaster/cfg"

	AuthFile        = CfgBase + "/auth"
	ServerConfigDir = CfgBase + "/servers"
	CertDir         = CfgBase + "/certs"

	NginxConfigDir = CfgBase + "/servers"
	NginxRootFile  = "/etc/nginx/nginx.conf"

	// NginxConfigDir  = "/opt/homebrew/etc/nginx/servers"
	// NginxRootFile = "/opt/homebrew/etc/nginx/nginx.conf"
)
