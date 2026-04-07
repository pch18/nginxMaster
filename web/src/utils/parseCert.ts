import { KJUR, X509 } from "jsrsasign";

export const splitCerts = (input: string): string[] => {
  return (
    input.match(
      /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g
    ) || []
  );
};

export const parseCerts = (input: string) => {
  const certs = splitCerts(input);
  return certs.map(parseCert);
};

export const parseMainCert = (input: string) => {
  const certs = splitCerts(input);
  if (!certs[0]) {
    throw new Error("No valid certificates found");
  }
  return parseCert(certs[0]);
};

export const parseCert = (certPem: string) => {
  const cert = new X509();
  cert.readCertPEM(certPem);

  const sanDomains =
    cert
      .getExtSubjectAltName()
      ?.array.map((item) =>
        item ? ("dns" in item ? item.dns : "ip" in item ? item.ip : "") : ""
      )
      .filter(Boolean) || [];

  return {
    subject: cert.getSubjectString(),
    issuer: cert.getIssuerString(),
    notBefore: formatCertTime(cert.getNotBefore()),
    notAfter: formatCertTime(cert.getNotAfter()),
    sanDomains: sanDomains.length > 0 ? sanDomains : undefined,
  };
};

export const validateCert = (pub: string, pvt: string) => {
  try {
    const testData = "TEST";
    const signer = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
    signer.init(pvt);
    signer.updateString(testData);
    const signature = signer.sign();

    const verifier = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
    verifier.init(pub);
    verifier.updateString(testData);
    return verifier.verify(signature);
  } catch {
    return false;
  }
};

export const validateMainCert = (pub: string, pvt: string) => {
  const certs = splitCerts(pub);
  if (!certs[0]) {
    throw new Error("No valid certificates found");
  }

  return validateCert(certs[0], pvt);
};

const formatCertTime = (value: string) => {
  const time = value.endsWith("Z") ? value.slice(0, -1) : value;

  if (time.length !== 12 && time.length !== 14) {
    return Math.floor(new Date(value).getTime() / 1000);
  }

  const year =
    time.length === 12
      ? `${Number(time.slice(0, 2)) >= 50 ? "19" : "20"}${time.slice(0, 2)}`
      : time.slice(0, 4);
  const offset = time.length === 12 ? 2 : 4;
  const month = time.slice(offset, offset + 2);
  const day = time.slice(offset + 2, offset + 4);
  const hour = time.slice(offset + 4, offset + 6);
  const minute = time.slice(offset + 6, offset + 8);
  const second = time.slice(offset + 8, offset + 10);

  const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  return Math.floor(new Date(dateStr).getTime() / 1000);
};
