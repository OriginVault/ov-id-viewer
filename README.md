<div style="width: 100%; display: flex; justify-content: center; align-items: center;">
      <img src="https://gray-objective-tiglon-784.mypinata.cloud/ipfs/Qma7EjPPPfomzEKkYcJa2ctEFPUhHaMwiojTR1wTQPg2x8" alt="OriginVault logo" width="300" height="300">
</div>
<br />

# 🚀 `@originvault/ov-id-viewer`
**Decentralized Identity Viewer for OriginVault**

`@originvault/ov-id-viewer` is a React component library designed to display and manage decentralized identities (DIDs) and verifiable credentials (VCs) using the `@originvault/ov-id-sdk`. It provides a user-friendly interface for interacting with DIDs and VCs, making it easier to integrate decentralized identity features into your web applications.

🔹 Features

- ✅ Display DIDs and associated metadata
- ✅ View and verify Verifiable Credentials
- ✅ Seamless integration with `@originvault/ov-id-sdk` for DID management
- ✅ User-friendly UI components for decentralized identity operations
- ✅ Customizable and extendable for various use cases

---

## 📦 Installation
```bash
npm install @originvault/ov-id-viewer
```

---

## 🚀 Quick Start

### **1️⃣ Integrate the Viewer in Your Application**
```typescript
import React from 'react';
import { OVIdViewer } from '@originvault/ov-id-viewer';

const App = () => {
  return (
    <div>
      <h1>Decentralized Identity Viewer</h1>
      <OVIdViewer />
    </div>
  );
};

export default App;
```

---

### **2️⃣ Display DIDs and Verifiable Credentials**
The `OVIdViewer` component automatically fetches and displays DIDs and VCs using the `@originvault/ov-id-sdk`. Ensure the SDK is properly configured in your application.

---

## 🛠 Configuration
| **Prop** | **Description** |
|----------|-----------------|
| `sdkConfig` | Configuration object for `@originvault/ov-id-sdk` integration |
| `theme` | (Optional) Custom theme settings for the viewer UI |

---

## 🏗 Built With
- **[React](https://reactjs.org/)** → UI library for building user interfaces
- **[@originvault/ov-id-sdk](https://github.com/originvault/ov-id-sdk)** → SDK for decentralized identity management
- **[Styled Components](https://styled-components.com/)** → For styling the UI components

---

## 📜 License
`@originvault/ov-id-viewer` is licensed under **MIT**.

---

## 🚀 Next Steps
- [ ] Add support for additional identity standards
- [ ] Enhance UI customization options
- [ ] Implement advanced filtering and search for DIDs and VCs

---

### **🌟 Contributors & Feedback**
If you have suggestions or want to contribute, open an issue or pull request on [GitHub](https://github.com/originvault/ov-id-viewer).

🚀 **Now, `ov-id-viewer` is ready to enhance your decentralized identity applications!**
