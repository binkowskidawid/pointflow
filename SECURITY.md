# Security Policy

## Supported Versions

PointFlow is currently in active development. Security patches are applied to the latest release only.

| Version | Supported           |
| ------- | ------------------- |
| 1.0.x   | ✅ Yes              |
| < 1.0   | ❌ No (pre-release) |

---

## Reporting a Vulnerability

We take the security of PointFlow and its users seriously. If you discover a security vulnerability — regardless of its severity — please **do not open a public GitHub issue**.

Instead, report it privately via one of the following channels:

- **Email:** [d.k.binkowski@gmail.com](mailto:d.k.binkowski@gmail.com)
- **GitHub Private Advisory:** [Report a vulnerability](https://github.com/binkowskidawid/pointflow/security/advisories/new)

Please include as much detail as possible in your report:

- A clear description of the vulnerability and its potential impact
- The affected component(s) (e.g. `api-gateway`, `auth`, `loyalty-engine`)
- Steps to reproduce the issue or a minimal proof-of-concept
- Any suggested mitigation or fix, if you have one

### Response Timeline

| Stage                        | Target time                               |
| ---------------------------- | ----------------------------------------- |
| Initial acknowledgement      | Within **48h**                            |
| Triage & severity assessment | Within **5 days**                         |
| Patch or mitigation released | Within **30 days** (critical: **7 days**) |
| Public disclosure            | After patch is available                  |

We follow **coordinated disclosure** — we ask that you give us a reasonable window to address the issue before any public disclosure.

---

## Scope

The following are **in scope** for security reports:

- Authentication and authorization flaws (`services/auth`)
- JWT token handling, secret exposure, or privilege escalation
- Tenant isolation bypasses (cross-tenant data access)
- SQL/NoSQL injection via Drizzle ORM queries
- Remote code execution or command injection
- Insecure deserialization in Kafka event payloads
- Exposed secrets, credentials, or environment variables
- Misconfigurations in Docker Compose affecting production deployments

The following are **out of scope**:

- Vulnerabilities in third-party dependencies that are already publicly disclosed (please open a regular issue or PR to bump the dependency)
- Findings from automated scanners without a verified proof-of-concept
- Social engineering attacks
- Physical security issues
- Denial-of-service attacks requiring sustained high-volume traffic

---

## Security Considerations for Self-Hosters

PointFlow is designed to be self-hosted. When deploying your own instance, please follow these practices:

### Secrets & Environment Variables

- Never commit `.env` files to version control
- Rotate the `JWT_SECRET` before going to production — do not use the default from `.env.example`
- Use Docker secrets or a secrets manager (e.g. Vault, AWS Secrets Manager) in production environments

### Network Exposure

- The `docker-compose.prod.yml` stack is intended to be placed **behind a reverse proxy** (e.g. Nginx, Caddy, Traefik)
- CockroachDB (port `26257` / UI `8080`), Kafka (port `9092`), and Kafka UI (port `8090`) should **never be exposed publicly**
- MailHog (port `8025`) is for development only — remove it from production deployments
- Use Tailscale or a private VPN for administrative access to infrastructure services

### Authentication

- JWT tokens are stateless — implement token revocation (e.g. a blocklist) if your deployment requires immediate session invalidation
- Enforce HTTPS on all publicly reachable endpoints; never run JWT-authenticated APIs over plain HTTP in production

### Kafka

- PointFlow uses Kafka 4.2 KRaft (no Zookeeper). Ensure the Kafka broker is not accessible outside the Docker network
- Validate and sanitise all Kafka event payloads in consumers — treat them as untrusted input

### CockroachDB

- Use the dedicated `pointflow_user` account with the minimum required privileges
- Enable TLS for CockroachDB connections in production (`sslmode=verify-full`)

---

## Dependency Security

We use [Dependabot](https://docs.github.com/en/code-security/dependabot) and GitHub Actions CI to monitor for known vulnerabilities in dependencies. You can audit the dependency tree at any time:

```bash
pnpm audit
```

If you find a vulnerable dependency that is not yet flagged, feel free to open a regular GitHub issue or submit a PR with the updated version.

---

## Acknowledgements

We are grateful to security researchers who responsibly disclose vulnerabilities. Confirmed, in-scope reports will be acknowledged in the release notes of the corresponding patch.

---

_MIT © [Dawid Bińkowski](https://github.com/binkowskidawid) — See [LICENSE](./LICENSE) for details._
