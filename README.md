<div align="center">
  <h1>Hi, I'm Manokar G 👋</h1>
  <h3>Systems Architect • DevOps Engineer • AI Infrastructure & GitOps</h3>
  <p>Architecting resilient bare-metal hybrid clouds, autonomous local AI pipelines, and GitOps-driven automation systems.</p>

  <p>
    <a href="https://manokarg.github.io/manokarg/"><img src="https://img.shields.io/badge/🌐_Interactive_Portfolio-Live_Demo-3b82f6?style=for-the-badge&logoColor=white" alt="Live Portfolio"></a>
    <a href="https://manokarg.github.io/manokarg/homelab.html"><img src="https://img.shields.io/badge/🛸_Enterprise_Homelab-Architecture_Case_Study-8b5cf6?style=for-the-badge&logoColor=white" alt="Homelab Case Study"></a>
    <a href="https://manokarg.github.io/manokarg/home-automation.html"><img src="https://img.shields.io/badge/⚡_Smart_Home_IoT-ESP32_&_Edge_Mesh-10b981?style=for-the-badge&logoColor=white" alt="Home Automation Case Study"></a>
  </p>
</div>

---

### 🏛️ Engineering Philosophy & System Architecture

I build high-availability computing platforms where bare-metal hardware meets modern cloud-native standards. All infrastructure is managed with **GitOps as the single source of truth**, backed by continuous self-healing observability and localized AI inference.

```
+-------------------------------------------------------------------------+
|                         Zero-Trust Edge Layer                           |
|       Cloudflare Tunnels  •  Traefik v3  •  Authelia SSO / MFA          |
+------------------------------------+------------------------------------+
                                     |
+------------------------------------+------------------------------------+
|                      Compute & AI Inference Tier                        |
|   Proxmox VE 8.x  •  Docker Compose  •  Ollama  •  LangGraph  •  n8n     |
+------------------------------------+------------------------------------+
                                     |
+------------------------------------+------------------------------------+
|                   Telemetry & Automated Self-Healing                    |
|       Prometheus  •  cAdvisor  •  Loki  •  LLM Triage  •  Ansible        |
+------------------------------------+------------------------------------+
                                     |
+------------------------------------+------------------------------------+
|                        Storage & Hardware Tier                          |
|         NVMe Hot Cache  •  6.9TB MergerFS Pool  •  ESP32 Edge Fleet     |
+-------------------------------------------------------------------------+
```

---

### 📂 Featured Systems & Deep-Dive Case Studies

#### 🛸 [Enterprise Hybrid Cloud & Autonomous AI Lab](https://manokarg.github.io/manokarg/homelab.html)
> *A production-grade, 4-node bare-metal hybrid cloud spanning AMD Ryzen and Intel Core hypervisors with dual ARM64 edge diagnostics nodes.*

- **Role:** Systems Architect & DevOps Engineer
- **Core Tech:** Proxmox VE 8.x, Ansible, Docker Compose, Traefik v3, Authelia, LangGraph, Ollama, Prometheus, Loki, Grafana
- **Key Architectural Highlights:**
  - **GitOps & IaC:** 100% of infrastructure, network routing, and container manifests declared in version-controlled Git with Ansible Vault encryption.
  - **Closed-Loop Self-Healing:** Automated pipeline detects service anomalies via Prometheus edge probing, pulls trailing logs, triages with a local LLM, and triggers Ansible remediation playbooks with an MTTR of under 45 seconds.
  - **Distributed AI Pipeline:** Local multi-model gateway (DeepSeek & Llama) driving LangGraph DAG agents and sandboxed execution environments.
  - **Resilient Tiered Storage:** 1.5TB hot NVMe flash for VM roots and transactional databases, unified with 5.4TB net MergerFS bulk storage via hardware SATA passthrough.
  - 📖 **[Read the Full Interactive Architecture Case Study →](https://manokarg.github.io/manokarg/homelab.html)**

#### ⚡ [Smart Home IoT & Edge Mesh](https://manokarg.github.io/manokarg/home-automation.html)
> *High-reliability, privacy-first local automation cluster orchestrating custom-built ESP32 microcontrollers and commercial smart devices.*

- **Role:** Hardware & Systems Engineer
- **Core Tech:** Home Assistant Supervised, ESPHome, ESP32, Zigbee/Matter, MQTT, Local Voice AI (Whisper & Piper)
- **Key Architectural Highlights:**
  - **Zero-Cloud Dependency:** 100% offline local execution for mission-critical environmental controls and access management.
  - **Custom Sensor Engineering:** Hand-soldered ESP32 nodes running bespoke ESPHome firmware for high-precision temperature, humidity, presence, and power metering.
  - **Localized Voice Processing:** Sub-second speech recognition and synthetic text-to-speech executed entirely within the private LAN.
  - 📖 **[Read the Smart Home Engineering Case Study →](https://manokarg.github.io/manokarg/home-automation.html)**

---

### 🛠️ Technical Arsenal

| Domain | Technologies & Tooling |
| :--- | :--- |
| **Virtualization & OS** | `Proxmox VE 8.x` `Debian GNU/Linux` `Ubuntu Server` `Docker` `Docker Compose` |
| **Infrastructure as Code** | `Ansible` `GitOps` `Bash / Shell Scripting` `YAML` |
| **Edge Routing & Security** | `Traefik v3` `Authelia (SSO / 2FA)` `Cloudflare Zero Trust` `WireGuard` `Tailscale` `AdGuard Home` |
| **AI & Automation** | `Ollama` `LangGraph` `LangSmith` `n8n Automation` `Python` `LXC Sandboxing` |
| **Observability & Metrics**| `Prometheus` `Grafana` `Loki` `cAdvisor` `Uptime Kuma` `WatchYourLAN` |
| **Storage & Databases** | `MergerFS (Tiered Storage)` `PostgreSQL` `Redis` `SQLite` `SATA Passthrough` |
| **Full-Stack & Frontend** | `JavaScript / TypeScript` `Node.js` `React` `Next.js` `Tailwind CSS` `GSAP` `Three.js` |

---

### 📊 GitHub Activity & Metrics

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=ManokarG&show_icons=true&theme=tokyonight&hide_border=true&bg_color=050508&title_color=60a5fa&text_color=94a3b8&icon_color=a855f7" alt="Manokar's GitHub Stats" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=ManokarG&layout=compact&theme=tokyonight&hide_border=true&bg_color=050508&title_color=60a5fa&text_color=94a3b8" alt="Top Languages" />
</div>

---

### 🌐 Connect & Collaborate

<p align="center">
  <a href="https://manokarg.github.io/manokarg/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-050508?style=for-the-badge&logo=google-chrome&logoColor=60a5fa" alt="Portfolio" />
  </a>
  <a href="https://github.com/ManokarG" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:cmano.gar04@gmail.com">
    <img src="https://img.shields.io/badge/Email-cmano.gar04@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>
