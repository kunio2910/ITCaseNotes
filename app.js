(() => {
  const STORAGE_KEY = "it-case-notes-v1";
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztFNsgy97o330lkOpT9zEpGuk2brnA5d29lHa9J4d9lCl2HM-A9i1BahruAqiv8VEAVA/exec";
  const cloudState = { status: "Đang kết nối", syncing: false };
  const categoryColors = ["#287fd6", "#e89927", "#eb5d3f", "#7156c7", "#21a36d", "#3c526c", "#d34a8b", "#5c8c2f"];

  const seedCases = [
    {
      id: "case-001", title: "Không thể Add Printer qua USB (Windows 11)", category: "Máy in", status: "Đã xử lý", device: "HP M211dw", os: "Windows 11 25H2",
      symptoms: "Windows nhận diện thiết bị nhưng không thể Add Printer.\nThông báo lỗi: \"Unspecified\".",
      cause: "Driver máy in cũ hoặc không tương thích với Windows 11 25H2.\nDịch vụ Print Spooler bị lỗi.\nCổng USB hoặc thiết bị không ổn định.",
      resolution: "Kiểm tra thiết bị trong Device Manager.\nGỡ driver cũ, khởi động lại dịch vụ Print Spooler.\nCài driver đúng model (HP M211dw).\nKết nối lại USB và thêm máy in.\nIn thử trang test.",
      commands: "Get-Service Spooler\nRestart-Service Spooler", result: "Đã cài được driver máy in và in test thành công.", tags: ["HP M2111", "USB", "Driver", "Windows 11"], favorite: true,
      attachments: [{ name: "error-printer.png", src: "" }, { name: "device-manager.png", src: "" }], createdAt: "2026-10-20T09:15:00+07:00", updatedAt: "2026-10-22T10:45:00+07:00", deleted: false
    },
    {
      id: "case-002", title: "Màn hình đen khi Enable Intel Graphics", category: "Windows", status: "Đã xử lý", device: "Laptop Dell", os: "Windows 11",
      symptoms: "Sau logo BIOS màn hình đen, Safe Mode vào được.", cause: "Driver Intel Graphics bị lỗi sau Windows Update.", resolution: "Khởi động vào Safe Mode.\nDùng Display Driver Uninstaller để gỡ driver cũ.\nCài lại driver Intel Graphics từ trang hãng.", commands: "pnputil /enum-drivers", result: "Màn hình hiển thị ổn định sau khi cài driver chính hãng.", tags: ["Windows", "Intel", "VGA", "Driver"], favorite: false,
      attachments: [], createdAt: "2026-10-18T14:20:00+07:00", updatedAt: "2026-10-21T08:10:00+07:00", deleted: false
    },
    {
      id: "case-003", title: "Outlook không gửi được email", category: "Microsoft 365", status: "Đã xử lý", device: "Microsoft Outlook", os: "Windows 11",
      symptoms: "Outlook báo lỗi SMTP Authentication Failed khi gửi email.", cause: "Tài khoản chưa bật xác thực hiện đại hoặc mật khẩu ứng dụng đã hết hạn.", resolution: "Kiểm tra trạng thái tài khoản Microsoft 365.\nXóa credential Outlook trong Windows Credential Manager.\nĐăng nhập lại và gửi email thử.", commands: "cmdkey /list", result: "Outlook gửi nhận email bình thường.", tags: ["Microsoft 365", "Outlook", "SMTP"], favorite: false,
      attachments: [], createdAt: "2026-10-16T11:00:00+07:00", updatedAt: "2026-10-21T09:35:00+07:00", deleted: false
    },
    {
      id: "case-004", title: "Không truy cập được SharePoint", category: "Mạng / Internet", status: "Đang xác minh", device: "Microsoft Edge", os: "Windows 11",
      symptoms: "Báo lỗi bị nhận, không mở được trang SharePoint.", cause: "DNS nội bộ trả về địa chỉ cũ và phiên đăng nhập đã hết hạn.", resolution: "Xóa cache DNS.\nĐăng xuất rồi đăng nhập lại Microsoft 365.\nKiểm tra kết nối bằng trình duyệt ẩn danh.", commands: "ipconfig /flushdns", result: "Đang theo dõi thêm sau khi đổi DNS.", tags: ["Mạng / Internet", "SharePoint"], favorite: false,
      attachments: [], createdAt: "2026-10-14T13:20:00+07:00", updatedAt: "2026-10-20T16:05:00+07:00", deleted: false
    },
    {
      id: "case-005", title: "HP402 bị sai chiều lật giấy (Flip Over/Flip Up)", category: "Máy in", status: "Đã xử lý", device: "HP LaserJet Pro M402", os: "Windows 10",
      symptoms: "Driver tự đảo chiều lật khi chọn in hai mặt.", cause: "Thiết lập duplex mặc định của driver bị sai.", resolution: "Mở Printing Preferences.\nChọn Flip Over cho tài liệu dọc.\nLưu cấu hình và in thử hai mặt.", commands: "control printers", result: "Bản in hai mặt đúng chiều mong muốn.", tags: ["Máy in", "HP402", "Duplex"], favorite: false,
      attachments: [], createdAt: "2026-10-11T10:30:00+07:00", updatedAt: "2026-10-16T15:12:00+07:00", deleted: false
    }
  ];

  const seedNotes = [
    {
      id: "note-001", title: "Kiểm tra và khởi động lại Print Spooler", category: "Windows", noteName: "Print Spooler", content: "Ghi nhớ nhanh các bước kiểm tra khi máy in không nhận lệnh in hoặc bị treo hàng đợi.", commands: "Get-Service Spooler\nRestart-Service Spooler", result: "Dịch vụ chạy lại bình thường, có thể tiếp tục kiểm tra driver nếu lỗi còn tiếp diễn.", createdAt: "2026-10-21T08:30:00+07:00", updatedAt: "2026-10-22T09:15:00+07:00", deleted: false
    },
    {
      id: "note-002", title: "Làm sạch DNS trên máy người dùng", category: "Mạng / Internet", noteName: "DNS nhanh", content: "Dùng khi người dùng không truy cập được website hoặc dịch vụ nội bộ sau khi thay đổi mạng.", commands: "ipconfig /flushdns\nipconfig /renew", result: "Kiểm tra lại bằng trình duyệt ẩn danh sau khi chạy lệnh.", createdAt: "2026-10-19T14:10:00+07:00", updatedAt: "2026-10-19T14:10:00+07:00", deleted: false
    }
  ];

  const defaultCategories = ["Windows", "Máy in", "Microsoft 365", "Mạng / Internet", "Phần cứng", "Bảo mật", "Phần mềm", "Khác"];
  const iconPaths = {
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 5.5V21.5A2.5 2.5 0 0 1 6.5 19H20M8 7h8M8 11h8"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    star: '<path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z"/>',
    folder: '<path d="M3 6.5h6l1.5 2H21v9.8a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 18.3V6.5Z"/>',
    settings: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.6 2.6l-.1-.1a1.8 1.8 0 0 0-3.1 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3.1-1.3l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.8 1.8 0 0 0-1.3-3.1H3a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3.1l-.1-.1A1.8 1.8 0 1 1 7 2.5l.1.1a1.8 1.8 0 0 0 3.1-1.3V1.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3.1 1.3l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.8 1.8 0 0 0 1.3 3.1h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.3 3.1Z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.2 4.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="m4 16.5-.7 4.2 4.2-.7L19 8.5 15.5 5 4 16.5Z"/><path d="m13.8 6.7 3.5 3.5"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M4 20h16"/>',
    upload: '<path d="M12 16V5M7 9l5-5 5 5M4 20h16"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.1 1.9c-1 .8-1.7 1.2-1.7 2.6M12 17h.01"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 4.5-4.5 3 3 2-2 4.5 4.5"/>',
    command: '<path d="m7 8 4 4-4 4M13 16h5"/>',
    archive: '<path d="M4 7h16v13H4zM3 4h18v3H3zM10 11h4"/>',
    palette: '<path d="M12 4a8 8 0 1 0 0 16h1.5a1.5 1.5 0 0 0 0-3H12a1.5 1.5 0 0 1 0-3h2a6 6 0 0 0 0-10h-2Z"/><circle cx="7.5" cy="9" r=".7"/><circle cx="10" cy="6.8" r=".7"/><circle cx="14" cy="7" r=".7"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.8-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.8 4L21 14m0 5v-5h-5"/>',
    printer: '<path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6zM17 12h.01"/>',
    windows: '<path d="m3 5 8-1v8H3V5ZM13 3.8l8-1.1V12h-8V3.8ZM3 14h8v8l-8-1.1V14ZM13 14h8v9.3l-8-1.1V14Z"/>'
  };

  const icon = (name, size = 18) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.info}</svg>`;
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const uid = () => `case-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const formatDate = (value) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
  const formatDateTime = (value) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  const tagClass = (tag) => /máy|windows|hp|usb/i.test(tag) ? "green" : /driver|mạng|sharepoint|duplex/i.test(tag) ? "purple" : /microsoft|outlook|smtp/i.test(tag) ? "red" : "";
  const getStored = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
  };
  const stored = getStored();
  const state = {
    cases: stored?.cases?.length ? stored.cases : seedCases,
    notes: Array.isArray(stored?.notes) ? stored.notes : seedNotes,
    categories: stored?.categories?.length ? stored.categories : defaultCategories,
    view: "cases", selectedId: stored?.cases?.find((item) => !item.deleted)?.id || seedCases[0].id, editingId: null, search: "", category: "Tất cả", status: "Tất cả", time: "Mới nhất",
    noteSelectedId: stored?.notes?.find((item) => !item.deleted)?.id || seedNotes[0].id, noteEditingId: null, noteSearch: "", noteCategory: "Tất cả",
    theme: stored?.theme || "light", pageSize: stored?.pageSize || "20", pendingAttachments: []
  };

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ cases: state.cases, notes: state.notes, categories: state.categories, theme: state.theme, pageSize: state.pageSize }));
  async function cloudRequest(payload) {
    if (!APPS_SCRIPT_URL) return null;
    const response = await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Apps Script trả về HTTP ${response.status}`);
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "Apps Script không xử lý được yêu cầu");
    return result;
  }
  function syncItem(action, item) {
    if (!APPS_SCRIPT_URL || !item) return;
    const payload = action === "upsertCategory" ? { action, name: item.name } : { action, item };
    cloudRequest(payload).then(() => { cloudState.status = "Đã đồng bộ"; }).catch((error) => { cloudState.status = "Lỗi đồng bộ"; console.error(error); toast(`Không thể đồng bộ Google Sheet: ${error.message}`, "error"); });
  }
  async function syncAllToCloud() {
    cloudState.syncing = true;
    cloudState.status = "Đang đồng bộ";
    try {
      for (const name of state.categories) await cloudRequest({ action: "upsertCategory", name });
      for (const item of state.cases) await cloudRequest({ action: "upsertCase", item });
      for (const item of state.notes) await cloudRequest({ action: "upsertNote", item });
      cloudState.status = "Đã đồng bộ";
    } finally {
      cloudState.syncing = false;
    }
  }
  async function hydrateFromCloud() {
    if (!APPS_SCRIPT_URL) return;
    try {
      const result = await cloudRequest({ action: "bootstrap" });
      const remote = result?.data || {};
      const hasRemoteData = Boolean(remote.cases?.length || remote.notes?.length || remote.categories?.length);
      if (hasRemoteData) {
        state.cases = Array.isArray(remote.cases) ? remote.cases : [];
        state.notes = Array.isArray(remote.notes) ? remote.notes : [];
        state.categories = remote.categories?.length ? remote.categories : defaultCategories;
        state.selectedId = state.cases.find((item) => !item.deleted)?.id || null;
        state.noteSelectedId = state.notes.find((item) => !item.deleted)?.id || null;
        save(); render();
        cloudState.status = "Đã tải từ Google Sheet";
      } else {
        await syncAllToCloud();
        toast("Đã đưa dữ liệu mẫu lên Google Sheet.");
      }
    } catch (error) {
      cloudState.status = "Ngoại tuyến";
      console.error(error);
      toast(`Không tải được dữ liệu Google Sheet: ${error.message}`, "error");
    }
  }
  const activeCases = () => state.cases.filter((item) => !item.deleted);
  const activeNotes = () => state.notes.filter((item) => !item.deleted);
  const getCase = (id = state.selectedId) => state.cases.find((item) => item.id === id) || null;
  const getNote = (id = state.noteSelectedId) => state.notes.find((item) => item.id === id) || null;
  const matches = (item, search = state.search) => {
    if (item.deleted) return false;
    const haystack = [item.title, item.category, item.status, item.device, item.os, item.symptoms, item.cause, item.resolution, item.result, ...(item.tags || [])].join(" ").toLowerCase();
    return !search.trim() || haystack.includes(search.trim().toLowerCase());
  };
  const filteredCases = () => {
    let items = activeCases().filter((item) => matches(item));
    if (state.category !== "Tất cả") items = items.filter((item) => item.category === state.category);
    if (state.status !== "Tất cả") items = items.filter((item) => item.status === state.status);
    if (state.time === "Cũ nhất") items.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (state.time === "Tên A-Z") items.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    else items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return items;
  };
  const filteredNotes = () => {
    let items = activeNotes().filter((item) => {
      const haystack = [item.title, item.category, item.noteName, item.content, item.commands, item.result].join(" ").toLowerCase();
      return !state.noteSearch.trim() || haystack.includes(state.noteSearch.trim().toLowerCase());
    });
    if (state.noteCategory !== "Tất cả") items = items.filter((item) => item.category === state.noteCategory);
    return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };
  const toast = (message, type = "success") => {
    const node = document.createElement("div"); node.className = `toast ${type === "error" ? "error" : ""}`; node.innerHTML = `${icon(type === "error" ? "alert" : "check", 16)}<span>${esc(message)}</span>`;
    document.querySelector("#toast-region").append(node); setTimeout(() => node.remove(), 3200);
  };

  function navButton(view, label, iconName, count = "") {
    return `<button class="nav-button ${state.view === view ? "active" : ""}" data-view="${view}">${icon(iconName, 17)}<span>${label}</span>${count ? `<span class="count">${count}</span>` : ""}</button>`;
  }

  function renderSidebar() {
    const deletedCount = state.cases.filter((item) => item.deleted).length;
    return `<aside class="sidebar">
      <div class="brand"><span class="brand-mark">${icon("book", 21)}</span><div><strong>IT Case Notes</strong><small>Sổ tay xử lý sự cố IT</small></div></div>
      <nav class="nav" aria-label="Điều hướng chính">
        ${navButton("cases", "Tất cả case", "grid", activeCases().length)}
        ${navButton("favorites", "Yêu thích", "star", state.cases.filter((item) => item.favorite && !item.deleted).length)}
        ${navButton("notes", "Ghi chú", "book", activeNotes().length)}
        ${navButton("categories", "Danh mục", "folder", state.categories.length)}
        ${navButton("settings", "Cài đặt & Sao lưu", "settings", deletedCount ? `${deletedCount} đã xóa` : "")}
      </nav>
      <div class="sidebar-footer">Lưu cục bộ + Google Sheet<br />${cloudState.status} · ${activeCases().length} case đang hoạt động</div>
    </aside>`;
  }

  function tags(tags = []) { return `<div class="tag-row">${tags.map((tag) => `<span class="tag ${tagClass(tag)}">${esc(tag)}</span>`).join("")}</div>`; }

  function caseCard(item) {
    return `<button class="case-card ${state.selectedId === item.id ? "selected" : ""}" data-select-case="${item.id}">
      <div class="case-card-title">${icon(item.category === "Máy in" ? "printer" : "windows", 17)}<span>${esc(item.title)}</span><span class="star ${item.favorite ? "" : "off"}">${icon("star", 15)}</span></div>
      <p class="case-card-summary">${esc(item.symptoms.split("\n")[0])}</p>
      <div class="case-card-meta">${tags(item.tags.slice(0, 4))}<span>${formatDate(item.updatedAt)}</span></div>
    </button>`;
  }

  function detailSection(type, title, content, iconName) {
    return `<section class="detail-section ${type}"><div class="section-heading"><span class="section-icon">${icon(iconName, 13)}</span>${title}</div>${content}</section>`;
  }

  function detailPanel(item) {
    if (!item) return `<div id="case-detail-panel" class="panel detail-panel empty" tabindex="-1"><div><div class="empty-icon">${icon("book", 26)}</div><h2>Chọn một case để xem</h2><p>Danh sách case và nội dung xử lý sẽ hiển thị tại đây.</p></div></div>`;
    const steps = (item.resolution || "").split("\n").map((step) => step.trim()).filter(Boolean);
    return `<article id="case-detail-panel" class="panel detail-panel" tabindex="-1">
      <div class="detail-top"><div class="detail-title"><span class="case-icon">${icon(item.category === "Máy in" ? "printer" : "windows", 21)}</span><div><h2>${esc(item.title)}</h2>${tags(item.tags)}</div></div>
        <div class="detail-actions"><button class="button small" data-action="edit-case">${icon("edit", 14)} Chỉnh sửa</button><button class="button small" data-action="duplicate-case">${icon("copy", 14)} Nhân bản</button><button class="button small danger" data-action="delete-case">${icon("trash", 14)} Xóa</button></div></div>
      <div class="info-grid"><div class="info-item"><label>Thiết bị / Phần mềm</label><strong>${esc(item.device || "Chưa cập nhật")}</strong></div><div class="info-item"><label>Hệ điều hành</label><strong>${esc(item.os || "Chưa cập nhật")}</strong></div><div class="info-item"><label>Trạng thái</label><strong>${esc(item.status)}</strong></div><div class="info-item"><label>Cập nhật</label><strong>${formatDateTime(item.updatedAt)}</strong></div></div>
      ${detailSection("symptom", "Triệu chứng", `<p>${esc(item.symptoms || "Chưa ghi nhận")}</p>`, "alert")}
      ${detailSection("cause", "Nguyên nhân", `<p>${esc(item.cause || "Chưa xác minh")}</p>`, "help")}
      ${detailSection("resolution", "Các bước xử lý", `<ol class="steps">${steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>${item.commands ? `<pre class="code-block"><button class="copy-code" data-copy-code="${esc(item.commands)}" title="Sao chép">${icon("copy", 14)}</button>${esc(item.commands)}</pre>` : ""}`, "check")}
      ${detailSection("result", "Kết quả / Ghi chú", `<p>${esc(item.result || "Chưa cập nhật")}</p>${item.attachments?.length ? `<div class="attachments">${item.attachments.map((file) => `<div class="attachment">${file.src ? `<img src="${file.src}" alt="${esc(file.name)}" />` : `<span>${icon("image", 17)}${esc(file.name)}</span>`}</div>`).join("")}</div>` : ""}`, "info")}
    </article>`;
  }

  function topHeading(title, subtitle, actions = "") {
    return `<div class="page-heading"><div><p class="eyebrow">IT CASE NOTES</p><h1>${title}</h1><p class="subtle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
  }

  function listToolbar() {
    return `<div class="toolbar"><div class="search-row"><label class="search-input">${icon("search", 17)}<input id="case-search" type="search" value="${esc(state.search)}" placeholder="Tìm lỗi, thiết bị, nguyên nhân, cách xử lý..." aria-label="Tìm kiếm case" /></label><button class="button primary" data-action="search">${icon("search", 15)} Tìm kiếm</button></div><div class="filters"><select class="select" data-filter="category"><option>Tất cả danh mục</option>${state.categories.map((category) => `<option ${state.category === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select><select class="select" data-filter="time"><option>Mới nhất</option><option ${state.time === "Cũ nhất" ? "selected" : ""}>Cũ nhất</option><option ${state.time === "Tên A-Z" ? "selected" : ""}>Tên A-Z</option></select><select class="select" data-filter="status"><option>Tất cả trạng thái</option><option ${state.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option><option ${state.status === "Đang xác minh" ? "selected" : ""}>Đang xác minh</option></select></div></div>`;
  }

  function casesPage() {
    const items = state.view === "favorites" ? filteredCases().filter((item) => item.favorite) : filteredCases();
    if (state.view === "favorites" && !state.search) state.category = "Tất cả";
    const selected = items.some((item) => item.id === state.selectedId) ? getCase() : items[0];
    if (selected && state.selectedId !== selected.id) state.selectedId = selected.id;
    const heading = state.view === "favorites" ? "Case yêu thích" : "Tất cả case";
    return `<div class="page">${topHeading(heading, "Tra cứu nhanh nguyên nhân và các bước xử lý sự cố IT", `<button class="button primary" data-action="add-case">${icon("plus", 15)} Thêm case</button>`)}<div class="workspace-grid"><section class="panel list-panel">${listToolbar()}<div class="result-count"><span>${items.length} case${state.search ? ` khớp “${esc(state.search)}”` : ""}</span><span>${icon("archive", 13)} Lưu tự động</span></div><div class="case-list">${items.length ? items.map(caseCard).join("") : `<div class="empty"><div><div class="empty-icon">${icon("search", 24)}</div><h3>Không tìm thấy case</h3><p>Thử từ khóa khác hoặc xóa bộ lọc.</p></div></div>`}</div></section>${detailPanel(selected)}</div></div>`;
  }

  function caseDetailPage() {
    const item = getCase();
    return `<div class="page detail-page">${topHeading("Chi tiết case", "Toàn bộ thông tin và hướng xử lý của case đang chọn", `<button class="button" data-action="back-to-cases">${icon("back", 14)} Quay lại danh sách</button>`)}${detailPanel(item)}</div>`;
  }

  function noteCard(item) {
    return `<button class="case-card note-card ${state.noteSelectedId === item.id ? "selected" : ""}" data-select-note="${item.id}">
      <div class="case-card-title">${icon("book", 17)}<span>${esc(item.title)}</span></div>
      <p class="case-card-summary"><strong>${esc(item.noteName)}</strong> · ${esc(item.content)}</p>
      <div class="case-card-meta">${tags([item.category])}<span>${formatDate(item.updatedAt)}</span></div>
    </button>`;
  }

  function noteDetailPanel(item) {
    if (!item) return `<div id="note-detail-panel" class="panel detail-panel empty" tabindex="-1"><div><div class="empty-icon">${icon("book", 26)}</div><h2>Chọn một ghi chú để xem</h2><p>Nội dung ghi chú sẽ hiển thị tại đây.</p></div></div>`;
    return `<article id="note-detail-panel" class="panel detail-panel note-detail-panel" tabindex="-1">
      <div class="detail-top"><div class="detail-title"><span class="case-icon">${icon("book", 21)}</span><div><h2>${esc(item.title)}</h2>${tags([item.category, item.noteName])}</div></div>
        <div class="detail-actions"><button class="button small" data-action="edit-note">${icon("edit", 14)} Chỉnh sửa</button></div></div>
      <div class="info-grid"><div class="info-item"><label>Danh mục</label><strong>${esc(item.category)}</strong></div><div class="info-item"><label>Tên ghi chú</label><strong>${esc(item.noteName)}</strong></div><div class="info-item"><label>Tạo ngày</label><strong>${formatDate(item.createdAt)}</strong></div><div class="info-item"><label>Cập nhật</label><strong>${formatDateTime(item.updatedAt)}</strong></div></div>
      ${detailSection("note-section", "Nội dung ghi chú", `<p>${esc(item.content || "Chưa cập nhật")}</p>`, "book")}
      ${item.commands ? detailSection("note-section note-command-section", "Lệnh CMD / PowerShell", `<pre class="code-block"><button class="copy-code" data-copy-code="${esc(item.commands)}" title="Sao chép">${icon("copy", 14)}</button>${esc(item.commands)}</pre>`, "command") : ""}
      ${detailSection("note-section note-result-section", "Kết quả và ghi chú", `<p>${esc(item.result || "Chưa cập nhật")}</p>`, "info")}
    </article>`;
  }

  function notesPage() {
    const items = filteredNotes();
    const selected = items.some((item) => item.id === state.noteSelectedId) ? getNote() : items[0];
    if (selected && state.noteSelectedId !== selected.id) state.noteSelectedId = selected.id;
    return `<div class="page notes-page">${topHeading("Ghi chú", "Lưu nhanh các kiến thức, lệnh thường dùng và kết quả cần nhớ", `<button class="button primary" data-action="add-note">${icon("plus", 15)} Thêm ghi chú</button>`)}<div class="workspace-grid"><section class="panel list-panel note-list-panel"><div class="toolbar"><div class="search-row"><label class="search-input">${icon("search", 17)}<input id="note-search" type="search" value="${esc(state.noteSearch)}" placeholder="Tìm trong ghi chú, lệnh, danh mục..." aria-label="Tìm kiếm ghi chú" /></label><button class="button primary" data-action="search-notes">${icon("search", 15)} Tìm kiếm</button></div><div class="filters note-filters"><select class="select" data-note-filter="category"><option>Tất cả danh mục</option>${state.categories.map((category) => `<option ${state.noteCategory === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></div></div><div class="result-count"><span>${items.length} ghi chú${state.noteSearch ? ` khớp “${esc(state.noteSearch)}”` : ""}</span><span>${icon("archive", 13)} Lưu tự động</span></div><div class="case-list">${items.length ? items.map(noteCard).join("") : `<div class="empty"><div><div class="empty-icon">${icon("book", 24)}</div><h3>Chưa có ghi chú phù hợp</h3><p>Thử từ khóa khác hoặc tạo ghi chú mới.</p></div></div>`}</div></section>${noteDetailPanel(selected)}</div></div>`;
  }

  function noteDetailPage() {
    const item = getNote();
    return `<div class="page note-detail-page">${topHeading("Chi tiết ghi chú", "Toàn bộ nội dung ghi chú đang chọn", `<button class="button" data-action="back-to-notes">${icon("back", 14)} Quay lại ghi chú</button>`)}${noteDetailPanel(item)}</div>`;
  }

  function noteFormPage() {
    const item = getNote(state.noteEditingId) || { title: "", category: state.categories[0], noteName: "", content: "", commands: "", result: "" };
    const isEdit = Boolean(state.noteEditingId);
    return `<div class="page note-form-page">${topHeading(isEdit ? "Chỉnh sửa ghi chú" : "Thêm ghi chú", isEdit ? "Cập nhật nội dung ghi chú và lệnh cần nhớ" : "Lưu nhanh kiến thức hoặc lệnh hỗ trợ IT để tra cứu lại", `<button class="button" data-action="back-to-notes">${icon("back", 14)} Quay lại ghi chú</button>`)}<form id="note-form" class="panel form-panel note-form"><section class="form-section"><h3>${icon("book", 16)} Thông tin ghi chú</h3><div class="form-grid"><div class="field full"><label for="note-title">Tiêu đề <span class="required">*</span></label><input id="note-title" required value="${esc(item.title)}" placeholder="Ví dụ: Kiểm tra Print Spooler" /></div><div class="field"><label for="note-category">Danh mục</label><select id="note-category" class="select">${state.categories.map((category) => `<option ${item.category === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></div><div class="field"><label for="note-name">Tên ghi chú <span class="required">*</span></label><input id="note-name" required value="${esc(item.noteName)}" placeholder="Ví dụ: Print Spooler" /></div><div class="field full"><label for="note-content">Nội dung ghi chú <span class="required">*</span></label><textarea id="note-content" class="tall" required placeholder="Ghi nội dung cần nhớ...">${esc(item.content)}</textarea></div><div class="field full"><label for="note-commands">Lệnh CMD / PowerShell</label><textarea id="note-commands" placeholder="Có thể sao chép trực tiếp khi cần...">${esc(item.commands || "")}</textarea></div><div class="field full"><label for="note-result">Kết quả và ghi chú</label><textarea id="note-result" placeholder="Kết quả, lưu ý hoặc điều kiện áp dụng...">${esc(item.result || "")}</textarea></div></div></section><div class="form-footer"><button type="button" class="button" data-action="back-to-notes">Hủy</button><button type="submit" class="button primary">${icon("check", 15)} ${isEdit ? "Lưu thay đổi" : "Lưu ghi chú"}</button></div></form></div>`;
  }

  function tagsEditor(values = []) {
    return `<div class="tag-input" id="tag-editor">${values.map((tag) => `<span class="tag">${esc(tag)} <button type="button" data-remove-tag="${esc(tag)}" aria-label="Xóa tag">×</button></span>`).join("")}<input id="tag-input" placeholder="Thêm tag rồi Enter" /></div>`;
  }

  function formPage() {
    const item = getCase(state.editingId) || { title: "", category: state.categories[0], status: "Đang xác minh", device: "", os: "", symptoms: "", cause: "", resolution: "", commands: "", result: "", tags: [], attachments: [] };
    const isEdit = Boolean(state.editingId);
    const files = state.pendingAttachments.length ? state.pendingAttachments : item.attachments || [];
    return `<div class="page">${topHeading(isEdit ? "Chỉnh sửa case" : "Thêm case mới", isEdit ? "Cập nhật nguyên nhân, giải pháp hoặc ghi chú cho case" : "Ghi lại sự cố và các bước xử lý để dùng lại sau này", `<button class="button" data-action="cancel-form">${icon("back", 14)} Quay lại</button>`)}<form id="case-form" class="panel form-panel"><div class="form-layout"><div><section class="form-section"><h3>${icon("info", 16)} Thông tin case</h3><div class="form-grid"><div class="field full"><label for="title">Tiêu đề <span class="required">*</span></label><input id="title" required value="${esc(item.title)}" placeholder="Ví dụ: Không thể kết nối máy in qua USB" /></div><div class="field"><label for="category">Danh mục <span class="required">*</span></label><select id="category" class="select" required>${state.categories.map((category) => `<option ${item.category === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></div><div class="field"><label for="status">Trạng thái</label><select id="status" class="select"><option ${item.status === "Đang xác minh" ? "selected" : ""}>Đang xác minh</option><option ${item.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option></select></div><div class="field"><label for="device">Thiết bị / Phần mềm</label><input id="device" value="${esc(item.device)}" placeholder="HP M211dw, Outlook..." /></div><div class="field"><label for="os">Hệ điều hành</label><input id="os" value="${esc(item.os)}" placeholder="Windows 11 25H2" /></div><div class="field full"><label for="symptoms">Triệu chứng <span class="required">*</span></label><textarea id="symptoms" required placeholder="Mô tả dấu hiệu, thông báo lỗi...">${esc(item.symptoms)}</textarea></div><div class="field full"><label for="cause">Nguyên nhân</label><textarea id="cause" placeholder="Có thể ghi nguyên nhân chưa xác minh để cập nhật sau...">${esc(item.cause)}</textarea></div></div></section><section class="form-section"><h3>${icon("check", 16)} Cách xử lý <span class="required">*</span></h3><div class="field"><label for="resolution">Các bước xử lý (mỗi dòng là một bước)</label><textarea id="resolution" class="tall" required placeholder="1. Kiểm tra...\n2. Cài lại...">${esc(item.resolution)}</textarea></div><div class="field" style="margin-top:13px"><label for="commands">Lệnh CMD / PowerShell</label><textarea id="commands" placeholder="Có thể sao chép trực tiếp khi xử lý...">${esc(item.commands || "")}</textarea></div></section><section class="form-section"><h3>${icon("info", 16)} Kết quả và ghi chú</h3><div class="field"><label for="result">Kết quả / Ghi chú</label><textarea id="result" placeholder="Kết quả sau khi xử lý, lưu ý cho lần sau...">${esc(item.result || "")}</textarea></div></section></div><aside class="form-side"><section class="form-section"><h3>${icon("folder", 16)} Tag / Từ khóa</h3><div class="field">${tagsEditor(item.tags || [])}<p class="field-help">Tag giúp tìm kiếm case nhanh hơn.</p></div></section><section class="form-section"><h3>${icon("image", 16)} Hình ảnh / Tệp đính kèm</h3><label class="dropzone" for="attachment-input">${icon("upload", 24)}<span><strong>Kéo thả file vào đây</strong><small>hoặc chọn file (PNG, JPG, PDF...)</small></span><input id="attachment-input" type="file" multiple accept="image/*,.pdf,.txt,.log" /></label><div class="pending-files">${files.map((file) => `<div class="pending-file">${file.src ? `<img src="${file.src}" alt="" />` : icon("image", 17)}<span>${esc(file.name)}</span></div>`).join("")}</div></section></aside></div><div class="form-footer"><button type="button" class="button" data-action="cancel-form">Hủy</button><button type="submit" class="button primary">${icon("check", 15)} ${isEdit ? "Lưu thay đổi" : "Lưu case"}</button></div></form></div>`;
  }

  function searchPage() {
    const items = filteredCases();
    return `<div class="page search-page">${topHeading("Tìm kiếm case", "Tìm toàn văn trên tiêu đề, triệu chứng, nguyên nhân, giải pháp, tag và mã lỗi")}<div class="search-hero"><label class="search-input">${icon("search", 18)}<input id="global-search" type="search" value="${esc(state.search)}" placeholder="Ví dụ: Unspecified, Print Spooler, HP M211dw..." /></label><button class="button primary" data-action="search">${icon("search", 15)} Tìm kiếm</button></div><div class="result-count" style="padding-left:0"><span>${items.length} kết quả</span><span>Không cần bấm Enter, kết quả cập nhật tức thời</span></div><div class="search-results">${items.length ? items.map((item) => `<article class="search-result" data-select-case="${item.id}"><span class="case-icon">${icon(item.category === "Máy in" ? "printer" : "windows", 19)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.symptoms.split("\n")[0])}</p>${tags(item.tags)}</div><small class="subtle">${formatDate(item.updatedAt)}</small></article>`).join("") : `<div class="panel empty"><div><div class="empty-icon">${icon("search", 24)}</div><h3>Chưa có kết quả phù hợp</h3><p>Thử tên thiết bị, mã lỗi hoặc một từ khóa trong cách xử lý.</p></div></div>`}</div></div>`;
  }

  function categoriesPage() {
    return `<div class="page">${topHeading("Danh mục", "Nhóm case theo hệ điều hành, thiết bị, phần mềm và loại sự cố", `<button class="button primary" data-action="add-category">${icon("plus", 15)} Thêm danh mục</button>`)}<div class="categories-grid">${state.categories.map((category, index) => { const count = activeCases().filter((item) => item.category === category).length; return `<article class="category-card"><span class="category-color" style="background:${categoryColors[index % categoryColors.length]}">${icon(index < 2 ? "windows" : "folder", 18)}</span><div class="category-info"><strong>${esc(category)}</strong><small>${count} case</small></div><button class="more" data-edit-category="${esc(category)}" aria-label="Tùy chọn ${esc(category)}">${icon("more", 17)}</button></article>`; }).join("")}</div></div>`;
  }

  function settingsPage() {
    const deleted = state.cases.filter((item) => item.deleted);
    return `<div class="page">${topHeading("Cài đặt & Sao lưu", "Bảo vệ dữ liệu cục bộ và điều chỉnh cách hiển thị sổ tay")}
      <div class="settings-grid"><section class="settings-card"><h3>${icon("archive", 18)} Sao lưu dữ liệu</h3><p>Xuất toàn bộ case, danh mục, tag và ảnh đính kèm thành một file JSON để lưu trữ hoặc chuyển sang máy khác.</p><button class="button primary" data-action="export">${icon("download", 15)} Xuất bản sao</button><div class="setting-row"><span>Khôi phục dữ liệu</span><button class="button small" data-action="import">${icon("upload", 13)} Chọn file khôi phục</button></div><input id="settings-import" class="sr-only" type="file" accept="application/json,.json" /></section>
      <section class="settings-card"><h3>${icon("palette", 18)} Giao diện</h3><p>Tùy chỉnh giao diện và số lượng case hiển thị trong danh sách.</p><div class="setting-row"><span>Chế độ màu</span><select class="select" style="width:130px" data-setting="theme"><option value="light" ${state.theme === "light" ? "selected" : ""}>Sáng (Light)</option><option value="dark" ${state.theme === "dark" ? "selected" : ""}>Tối (Dark)</option></select></div><div class="setting-row"><span>Số case hiển thị</span><select class="select" style="width:130px" data-setting="pageSize"><option ${state.pageSize === "20" ? "selected" : ""}>20 case / trang</option><option ${state.pageSize === "50" ? "selected" : ""}>50 case / trang</option></select></div></section>
      <section class="settings-card" style="grid-column:1/-1"><h3>${icon("trash", 18)} Thùng rác ${deleted.length ? `<span class="tag red">${deleted.length}</span>` : ""}</h3><p>Case đã xóa mềm được giữ lại để khôi phục khi cần.</p>${deleted.length ? `<div class="trash-list">${deleted.map((item) => `<div class="trash-row"><div><strong>${esc(item.title)}</strong><small>Xóa lần cuối: ${formatDate(item.updatedAt)}</small></div><button class="button small" data-restore-case="${item.id}">${icon("refresh", 13)} Khôi phục</button></div>`).join("")}</div>` : `<span class="subtle">Thùng rác đang trống.</span>`}</section></div></div>`;
  }

  function render() {
    document.documentElement.dataset.theme = state.theme;
    const page = state.view === "form" ? formPage() : state.view === "detail" ? caseDetailPage() : state.view === "note-form" ? noteFormPage() : state.view === "note-detail" ? noteDetailPage() : state.view === "notes" ? notesPage() : state.view === "search" ? searchPage() : state.view === "categories" ? categoriesPage() : state.view === "settings" ? settingsPage() : casesPage();
    document.querySelector("#app").innerHTML = `${renderSidebar()}<main class="main">${page}</main>`;
  }

  function focusSearch(id = "case-search") { const input = document.getElementById(id); if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } }
  function formData() {
    const field = (id) => document.getElementById(id)?.value?.trim() || "";
    return { title: field("title"), category: field("category"), status: field("status"), device: field("device"), os: field("os"), symptoms: field("symptoms"), cause: field("cause"), resolution: field("resolution"), commands: field("commands"), result: field("result"), tags: [...document.querySelectorAll("#tag-editor .tag")].map((node) => node.textContent.replace("×", "").trim()), attachments: state.pendingAttachments };
  }
  function saveForm(event) {
    event.preventDefault();
    const data = formData();
    if (!data.title || !data.symptoms || !data.resolution) { toast("Vui lòng điền các trường bắt buộc.", "error"); return; }
    const now = new Date().toISOString();
    if (state.editingId) {
      const index = state.cases.findIndex((item) => item.id === state.editingId);
      state.cases[index] = { ...state.cases[index], ...data, attachments: data.attachments.length ? data.attachments : state.cases[index].attachments || [], updatedAt: now };
      state.selectedId = state.editingId; toast("Đã lưu thay đổi cho case.");
    } else {
      const item = { ...data, id: uid(), favorite: false, deleted: false, createdAt: now, updatedAt: now, attachments: data.attachments || [] };
      state.cases.unshift(item); state.selectedId = item.id; toast("Đã thêm case mới.");
    }
    state.pendingAttachments = []; state.editingId = null; state.view = "cases"; save(); render();
    syncItem("upsertCase", state.cases.find((item) => item.id === state.selectedId));
  }
  function noteFormData() {
    const field = (id) => document.getElementById(id)?.value?.trim() || "";
    return { title: field("note-title"), category: field("note-category"), noteName: field("note-name"), content: field("note-content"), commands: field("note-commands"), result: field("note-result") };
  }
  function saveNoteForm(event) {
    event.preventDefault();
    const data = noteFormData();
    if (!data.title || !data.noteName || !data.content) { toast("Vui lòng điền tiêu đề, tên ghi chú và nội dung.", "error"); return; }
    const now = new Date().toISOString();
    if (state.noteEditingId) {
      const index = state.notes.findIndex((item) => item.id === state.noteEditingId);
      state.notes[index] = { ...state.notes[index], ...data, updatedAt: now };
      state.noteSelectedId = state.noteEditingId; toast("Đã lưu thay đổi cho ghi chú.");
    } else {
      const item = { ...data, id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: now, updatedAt: now, deleted: false };
      state.notes.unshift(item); state.noteSelectedId = item.id; toast("Đã thêm ghi chú mới.");
    }
    state.noteEditingId = null; state.view = "notes"; save(); render();
    syncItem("upsertNote", state.notes.find((item) => item.id === state.noteSelectedId));
  }
  function parseTagsInput(event) {
    const input = event.target; if (event.key !== "Enter") return; event.preventDefault(); const value = input.value.trim(); if (!value) return; const editor = input.closest(".tag-input"); if (editor.querySelector(`[data-remove-tag="${CSS.escape(value)}"]`)) return; const tag = document.createElement("span"); tag.className = "tag"; tag.innerHTML = `${esc(value)} <button type="button" data-remove-tag="${esc(value)}" aria-label="Xóa tag">×</button>`; editor.insertBefore(tag, input); input.value = "";
  }
  async function readAttachments(files) {
    const selected = [...files].slice(0, 6);
    state.pendingAttachments = [];
    for (const file of selected) {
      const src = file.type.startsWith("image/") ? await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }) : "";
      state.pendingAttachments.push({ name: file.name, src });
    }
    render(); toast(`${state.pendingAttachments.length} tệp đã sẵn sàng đính kèm.`);
  }
  function exportData() {
    const payload = { format: "IT Case Notes backup", version: 2, exportedAt: new Date().toISOString(), categories: state.categories, cases: state.cases, notes: state.notes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `it-case-notes-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); toast("Đã xuất bản sao dữ liệu.");
  }
  function importData(file) {
    const reader = new FileReader(); reader.onload = () => { try { const payload = JSON.parse(reader.result); if (!Array.isArray(payload.cases) || !Array.isArray(payload.categories)) throw new Error("invalid"); state.cases = payload.cases; state.notes = Array.isArray(payload.notes) ? payload.notes : []; state.categories = payload.categories; state.selectedId = state.cases.find((item) => !item.deleted)?.id || null; state.noteSelectedId = state.notes.find((item) => !item.deleted)?.id || null; save(); render(); syncAllToCloud().then(() => toast("Đã khôi phục và đồng bộ dữ liệu lên Google Sheet.")).catch((error) => toast(`Đã khôi phục cục bộ nhưng đồng bộ thất bại: ${error.message}`, "error")); } catch { toast("File sao lưu không đúng định dạng IT Case Notes.", "error"); } }; reader.readAsText(file);
  }

  let caseSelectionTimer = null;
  let noteSelectionTimer = null;
  const focusPanel = (id) => requestAnimationFrame(() => {
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    panel.focus({ preventScroll: true });
  });
  const openCaseDetail = (id) => {
    clearTimeout(caseSelectionTimer);
    state.selectedId = id; state.view = "detail"; render(); focusPanel("case-detail-panel");
  };
  const openNoteDetail = (id) => {
    clearTimeout(noteSelectionTimer);
    state.noteSelectedId = id; state.view = "note-detail"; render(); focusPanel("note-detail-panel");
  };

  document.addEventListener("click", (event) => {
    const view = event.target.closest("[data-view]"); if (view) { state.view = view.dataset.view; state.search = state.view === "search" ? state.search : state.search; render(); return; }
    const select = event.target.closest("[data-select-case]"); if (select) {
      const id = select.dataset.selectCase;
      if (event.detail >= 2) { openCaseDetail(id); return; }
      clearTimeout(caseSelectionTimer);
      caseSelectionTimer = setTimeout(() => { state.selectedId = id; if (state.view === "search") state.view = "cases"; render(); }, 450);
      return;
    }
    const noteSelect = event.target.closest("[data-select-note]"); if (noteSelect) {
      const id = noteSelect.dataset.selectNote;
      if (event.detail >= 2) { openNoteDetail(id); return; }
      clearTimeout(noteSelectionTimer);
      noteSelectionTimer = setTimeout(() => { state.noteSelectedId = id; render(); }, 450);
      return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "add-case") { state.view = "form"; state.editingId = null; state.pendingAttachments = []; render(); return; }
    if (action === "cancel-form") { state.view = "cases"; state.editingId = null; state.pendingAttachments = []; render(); return; }
    if (action === "back-to-cases") { state.view = "cases"; render(); return; }
    if (action === "add-note") { state.view = "note-form"; state.noteEditingId = null; render(); return; }
    if (action === "back-to-notes") { state.view = "notes"; state.noteEditingId = null; render(); return; }
    if (action === "edit-note") { state.view = "note-form"; state.noteEditingId = state.noteSelectedId; render(); return; }
    if (action === "search-notes") { state.noteSearch = document.getElementById("note-search")?.value || state.noteSearch; state.view = "notes"; render(); return; }
    if (action === "edit-case") { state.view = "form"; state.editingId = state.selectedId; state.pendingAttachments = []; render(); return; }
    if (action === "duplicate-case") { const original = getCase(); if (!original) return; const now = new Date().toISOString(); const copy = { ...original, id: uid(), title: `${original.title} (Bản sao)`, favorite: false, deleted: false, createdAt: now, updatedAt: now }; state.cases.unshift(copy); state.selectedId = copy.id; save(); render(); syncItem("upsertCase", copy); toast("Đã nhân bản case."); return; }
    if (action === "delete-case") { const item = getCase(); if (!item) return; item.deleted = true; item.updatedAt = new Date().toISOString(); state.selectedId = activeCases()[0]?.id || null; save(); render(); syncItem("upsertCase", item); toast("Đã chuyển case vào thùng rác."); return; }
    if (action === "search") { state.search = document.getElementById("case-search")?.value || document.getElementById("global-search")?.value || state.search; state.view = state.view === "search" ? "search" : "cases"; render(); return; }
    if (action === "export") { exportData(); return; }
    if (action === "import") { document.getElementById("settings-import")?.click(); return; }
    if (action === "add-category") { const value = window.prompt("Tên danh mục mới:"); if (value?.trim() && !state.categories.includes(value.trim())) { state.categories.push(value.trim()); save(); render(); syncItem("upsertCategory", { name: value.trim() }); toast("Đã thêm danh mục."); } return; }
    if (event.target.closest("[data-copy-code]")) { navigator.clipboard?.writeText(event.target.closest("[data-copy-code]").dataset.copyCode); toast("Đã sao chép lệnh."); return; }
    const restore = event.target.closest("[data-restore-case]"); if (restore) { const item = getCase(restore.dataset.restoreCase); if (item) { item.deleted = false; item.updatedAt = new Date().toISOString(); save(); render(); syncItem("upsertCase", item); toast("Đã khôi phục case."); } return; }
    const editCategory = event.target.closest("[data-edit-category]"); if (editCategory) { const oldName = editCategory.dataset.editCategory; const next = window.prompt("Đổi tên danh mục:", oldName); if (next?.trim() && next.trim() !== oldName && !state.categories.includes(next.trim())) { const index = state.categories.indexOf(oldName); state.categories[index] = next.trim(); state.cases.forEach((item) => { if (item.category === oldName) item.category = next.trim(); }); save(); render(); syncItem("upsertCategory", { name: next.trim() }); state.cases.filter((item) => item.category === next.trim()).forEach((item) => syncItem("upsertCase", item)); toast("Đã cập nhật danh mục."); } return; }
    const removeTag = event.target.closest("[data-remove-tag]"); if (removeTag) { removeTag.closest(".tag")?.remove(); return; }
  });
  document.addEventListener("dblclick", (event) => {
    const select = event.target.closest("[data-select-case]");
    if (select) { openCaseDetail(select.dataset.selectCase); return; }
    const noteSelect = event.target.closest("[data-select-note]");
    if (noteSelect) openNoteDetail(noteSelect.dataset.selectNote);
  });
  document.addEventListener("input", (event) => {
    if (event.target.id === "case-search" || event.target.id === "global-search") { state.search = event.target.value; const id = event.target.id; render(); focusSearch(id); }
    if (event.target.id === "note-search") { state.noteSearch = event.target.value; render(); focusSearch("note-search"); }
  });
  document.addEventListener("keydown", (event) => { if (event.target.id === "tag-input") parseTagsInput(event); if (event.key === "Enter" && (event.target.id === "case-search" || event.target.id === "global-search")) { event.preventDefault(); state.search = event.target.value; render(); } if (event.key === "Enter" && event.target.id === "note-search") { event.preventDefault(); state.noteSearch = event.target.value; render(); } });
  document.addEventListener("change", (event) => {
    if (event.target.dataset.filter === "category") { state.category = event.target.value === "Tất cả danh mục" ? "Tất cả" : event.target.value; render(); }
    if (event.target.dataset.filter === "status") { state.status = event.target.value === "Tất cả trạng thái" ? "Tất cả" : event.target.value; render(); }
    if (event.target.dataset.filter === "time") { state.time = event.target.value; render(); }
    if (event.target.dataset.noteFilter === "category") { state.noteCategory = event.target.value === "Tất cả danh mục" ? "Tất cả" : event.target.value; render(); }
    if (event.target.dataset.setting === "theme") { state.theme = event.target.value; save(); render(); }
    if (event.target.dataset.setting === "pageSize") { state.pageSize = event.target.value.startsWith("50") ? "50" : "20"; save(); toast("Đã cập nhật tùy chọn hiển thị."); }
    if (event.target.id === "attachment-input" && event.target.files.length) readAttachments(event.target.files);
    if (event.target.id === "settings-import" && event.target.files.length) importData(event.target.files[0]);
  });
  document.addEventListener("submit", (event) => { if (event.target.id === "case-form") saveForm(event); if (event.target.id === "note-form") saveNoteForm(event); });
  save(); render();
  hydrateFromCloud();
})();
