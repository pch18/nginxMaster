import {
  LocationMode,
  type LocationConfig,
  type ServerConfig,
} from "./interface";

export const makeNginxServerConfig = (c: ServerConfig) => {
  const sslPem = "1";
  const sslKey = "1";
  const cmd: string[] = [
    `server_name ${c.domains
      .map((d) => d.trim())
      .filter((d) => d)
      .join(" ")};`,
  ];
  if (c.httpEn) {
    c.httpPorts.forEach((p) => cmd.push(`listen ${p};`));
  }
  if (c.sslEn) {
    c.sslPorts.forEach((p) => cmd.push(`listen ${p} ssl;`));
    if (c.sslHttp2En) {
      cmd.push(`http2 on;`);
    }
    if (sslPem) {
      cmd.push(`ssl_certificate ${sslPem};`);
    }
    if (sslKey) {
      cmd.push(`ssl_certificate_key ${sslKey};`);
    }
    cmd.push(`ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;`);
    if (c.sslForceEn) {
      cmd.push(`if ($scheme = http) {`);
      cmd.push(
        `\treturn 301 https://$host${
          c.sslPorts[0] ? `:${c.sslPorts[0]}` : ""
        }$request_uri;`
      );
      cmd.push(`}`);
    }
  }

  if (c.accessLogOff) {
    cmd.push("");
    cmd.push(`access_log  off;`);
  }

  if (c.nginxRaw.trim()) {
    cmd.push("");
    c.nginxRaw.split("\n").forEach((r) => cmd.push(r));
  }

  if (c.staticCacheEn) {
    cmd.push("");
    cmd.push(
      "location ~* .(css|js|eot|ttf|otf|woff|woff2|jpg|jpeg|png|gif|ico|svg|webp|tiff|bmp)$ {"
    );
    cmd.push("\texpires 30d;");
    cmd.push('\tadd_header Cache-Control "public, no-transform";');
    cmd.push("}");
  }

  c.locations.forEach((cl) => {
    cmd.push("");

    makeNginxLocationConfig(cl, c)
      .split("\n")
      .forEach((r) => {
        cmd.push(r);
      });
  });

  return `server {
${cmd.map((r) => `\t${r}`).join("\n")}
}`;
};

export const makeNginxLocationConfig = (
  c: LocationConfig,
  cs: ServerConfig
) => {
  const cmd: string[] = [];
  if (c.mode === LocationMode.Static) {
    cmd.push(`root ${c.static_root};`);
    if (c.static_indexEn && c.static_index) {
      cmd.push(`index ${c.static_index};`);
    }
    if (c.static_spaEn && c.static_spa) {
      cmd.push(`try_files $uri ${c.static_spa};`);
    }
  } else if (c.mode === LocationMode.Proxy) {
    cmd.push(`proxy_pass ${c.proxy_target};`);
    cmd.push(`proxy_set_header Host ${c.proxy_host || "$host"};`);
    cmd.push(`proxy_set_header X-Real-IP $remote_addr;`);
    cmd.push(`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`);
    cmd.push(`proxy_set_header X-Forwarded-Host $http_host;`);
    cmd.push(`proxy_set_header X-Forwarded-Port $server_port;`);
    cmd.push(`proxy_set_header X-Forwarded-Proto $scheme;`);
    if (cs.sslForceEn) {
      cmd.push(`proxy_redirect http:// https://;`);
    }
  } else if (c.mode === LocationMode.Redirect) {
    cmd.push(
      `return ${c.redirect_code} ${c.redirect_target}${
        c.redirect_takeUri ? "$request_uri" : ""
      };`
    );
  }
  if (c.nginxRaw.trim()) {
    c.nginxRaw.split("\n").forEach((r) => cmd.push(r));
  }
  return `location ${c.path} {
${cmd.map((r) => `\t${r}`).join("\n")}
}`;
};