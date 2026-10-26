(() => {
  const STORAGE_KEY = "it-case-notes-v1";
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztFNsgy97o330lkOpT9zEpGuk2brnA5d29lHa9J4d9lCl2HM-A9i1BahruAqiv8VEAVA/exec";
  const cloudState = { status: "Đang kết nối", syncing: false };
  const categoryColors = ["#287fd6", "#e89927", "#eb5d3f", "#7156c7", "#21a36d", "#3c526c", "#d34a8b", "#5c8c2f"];
  const DEFAULT_TOPIC_COLOR = "#f5f3ff";

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
      id: "note-001", title: "Kiểm tra và khởi động lại Print Spooler", category: "Windows", noteName: "Print Spooler", content: "Ghi nhớ nhanh các bước kiểm tra khi máy in không nhận lệnh in hoặc bị treo hàng đợi.", commands: "Get-Service Spooler\nRestart-Service Spooler", result: "Dịch vụ chạy lại bình thường, có thể tiếp tục kiểm tra driver nếu lỗi còn tiếp diễn.", tags: ["Print Spooler", "Máy in"], favorite: false, attachments: [], createdAt: "2026-10-21T08:30:00+07:00", updatedAt: "2026-10-22T09:15:00+07:00", deleted: false
    },
    {
      id: "note-002", title: "Làm sạch DNS trên máy người dùng", category: "Mạng / Internet", noteName: "DNS nhanh", content: "Dùng khi người dùng không truy cập được website hoặc dịch vụ nội bộ sau khi thay đổi mạng.", commands: "ipconfig /flushdns\nipconfig /renew", result: "Kiểm tra lại bằng trình duyệt ẩn danh sau khi chạy lệnh.", tags: ["DNS", "Mạng"], favorite: false, attachments: [], createdAt: "2026-10-19T14:10:00+07:00", updatedAt: "2026-10-19T14:10:00+07:00", deleted: false
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
  const safeTopicColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value) : DEFAULT_TOPIC_COLOR;
  const richFontSizes = { 1: "12px", 2: "14px", 3: "16px", 4: "18px", 5: "21px", 6: "24px", 7: "28px" };
  const richFontFamilies = ["Be Vietnam Pro", "Arial", "Tahoma", "Verdana", "Georgia", "Courier New"];
  const richAllowedTags = new Set(["A", "B", "BR", "DIV", "EM", "FONT", "I", "LI", "MARK", "OL", "P", "SPAN", "STRONG", "U", "UL"]);
  const richDangerousTags = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "SVG", "MATH", "LINK", "META"]);
  const richStyleProperties = ["background-color", "color", "font-family", "font-size", "font-style", "font-weight", "text-decoration"];
  function sanitizeRichStyle(styleText = "") {
    const source = document.createElement("span");
    source.setAttribute("style", styleText);
    const values = richStyleProperties.map(property => {
      const value = source.style.getPropertyValue(property).trim();
      return value && !/url\s*\(|expression\s*\(|javascript\s*:/i.test(value) ? `${property}:${value}` : "";
    }).filter(Boolean);
    return values.join(";");
  }
  function sanitizeRichHtml(value = "") {
    if (!value) return "";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = String(value);
    [...wrapper.querySelectorAll("*")].reverse().forEach(node => {
      if (richDangerousTags.has(node.tagName)) { node.remove(); return; }
      if (!richAllowedTags.has(node.tagName)) {
        node.replaceWith(...node.childNodes);
        return;
      }
      if (node.tagName === "FONT") {
        const replacement = document.createElement("span");
        if (node.getAttribute("face")) replacement.style.fontFamily = node.getAttribute("face");
        const size = richFontSizes[node.getAttribute("size")];
        if (size) replacement.style.fontSize = size;
        replacement.innerHTML = node.innerHTML;
        node.replaceWith(replacement);
        return;
      }
      [...node.attributes].forEach(attribute => {
        if (attribute.name === "style") return;
        if (node.tagName === "A" && ["href", "target", "rel"].includes(attribute.name)) return;
        node.removeAttribute(attribute.name);
      });
      if (node.tagName === "A") {
        const href = node.getAttribute("href") || "";
        if (!/^https?:\/\//i.test(href)) node.removeAttribute("href");
        else { node.setAttribute("target", "_blank"); node.setAttribute("rel", "noopener noreferrer"); }
      }
      if (node.hasAttribute("style")) {
        const cleanStyle = sanitizeRichStyle(node.getAttribute("style"));
        if (cleanStyle) node.setAttribute("style", cleanStyle); else node.removeAttribute("style");
      }
    });
    return wrapper.innerHTML;
  }
  function hasRichMarkup(value = "") { return /<\/?(a|b|br|div|em|font|i|li|mark|ol|p|span|strong|u|ul)(\s|>)/i.test(String(value)); }
  function richHtml(value = "") { return hasRichMarkup(value) ? sanitizeRichHtml(value) : esc(value).replace(/\r?\n/g, "<br>"); }
  function richTextToPlain(value = "") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = richHtml(value);
    wrapper.querySelectorAll("br").forEach(node => node.replaceWith(document.createTextNode("\n")));
    wrapper.querySelectorAll("div,p,li").forEach(node => node.appendChild(document.createTextNode("\n")));
    return (wrapper.textContent || "").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  function richDisplay(value = "") { return `<div class="rich-text">${richHtml(value)}</div>`; }
  function richEditor(id, label, value = "", placeholder = "") {
    const fonts = richFontFamilies.map(font => `<option value="${esc(font)}">${esc(font)}</option>`).join("");
    const sizes = Object.entries(richFontSizes).map(([key, size]) => `<option value="${key}">${size}</option>`).join("");
    return `<div class="rich-field"><label>${label}</label><div class="rich-toolbar" data-toolbar-for="${id}" role="toolbar" aria-label="Định dạng ${esc(label)}"><button type="button" class="rich-tool" data-rich-command="bold" data-rich-editor="${id}" title="Đậm"><strong>B</strong></button><button type="button" class="rich-tool" data-rich-command="removeFormat" data-rich-editor="${id}" title="Chữ thường">Aa</button><button type="button" class="rich-tool" data-rich-command="italic" data-rich-editor="${id}" title="Nghiêng"><em>I</em></button><button type="button" class="rich-tool highlight-tool" data-rich-command="hiliteColor" data-rich-value="#fff3a3" data-rich-editor="${id}" title="Highlight">A</button><select class="rich-select" data-rich-command="fontName" data-rich-editor="${id}" aria-label="Font chữ"><option value="">Font chữ</option>${fonts}</select><select class="rich-select" data-rich-command="fontSize" data-rich-editor="${id}" aria-label="Cỡ chữ"><option value="">Cỡ chữ</option>${sizes}</select></div><div id="rich-${id}" class="rich-editor ${id === "resolution" ? "tall" : ""}" contenteditable="true" data-rich-editor="${id}" data-placeholder="${esc(placeholder)}" role="textbox" aria-multiline="true">${richHtml(value)}</div></div>`;
  }
  const topicColorChoices = [{value:"#f5f3ff",label:"Tím"},{value:"#e8f1ff",label:"Xanh dương"},{value:"#e7f8ef",label:"Xanh lá"},{value:"#fff6d8",label:"Vàng"},{value:"#fff0df",label:"Cam"},{value:"#ffe8ec",label:"Đỏ"},{value:"#ffeafa",label:"Hồng"},{value:"#eef1f5",label:"Xám"}];
  function decorateRichEditors() {
    const editorFields = state.view === "form" ? {symptoms:"Triệu chứng", cause:"Nguyên nhân", resolution:"Các bước xử lý", result:"Kết quả / Ghi chú"} : state.view === "note-form" ? {"note-content":"Nội dung ghi chú", "note-result":"Kết quả và ghi chú"} : {};
    for (const [id, label] of Object.entries(editorFields)) {
      const textarea = document.getElementById(id);
      if (!textarea) continue;
      const field = textarea.closest(".field");
      field.innerHTML = richEditor(id, label, textarea.value, textarea.getAttribute("placeholder") || "");
    }
  }
  function decorateNoteTags() {
    if (state.view !== "note-form" || document.getElementById("note-tag-editor")) return;
    const nameField = document.getElementById("note-name")?.closest(".field");
    if (!nameField) return;
    const item = getNote(state.noteEditingId);
    nameField.insertAdjacentHTML("afterend", `<div class="field full"><label for="note-tag-input">Tag / Từ khóa</label>${tagsEditor(item?.tags || [], "note-tag-editor", "note-tag-input")}<p class="field-help">Nhấn Enter sau mỗi tag để tìm kiếm nhanh hơn.</p></div>`);
  }
  function decorateTopicColorPicker() {
    const input = document.getElementById("topic-color");
    if (!input || input.type === "hidden") return;
    const selected = safeTopicColor(input.value);
    const wrapper = input.closest(".topic-color-control");
    if (!wrapper) return;
    wrapper.innerHTML = `<div class="topic-swatches" role="radiogroup" aria-label="Màu chủ đề">${topicColorChoices.map(choice => `<button type="button" class="topic-swatch ${choice.value.toLowerCase() === selected.toLowerCase() ? "active" : ""}" style="--swatch-color:${choice.value}" data-topic-color="${choice.value}" aria-label="${choice.label}" aria-pressed="${choice.value.toLowerCase() === selected.toLowerCase()}"><span></span>${choice.label}</button>`).join("")}</div><input id="topic-color" type="hidden" value="${selected}" />`;
  }
  function decorateCloudinaryButtons() {
    document.querySelectorAll(".cloudinary-button").forEach(node => { node.dataset.action = "open-cloudinary"; node.setAttribute("role", "button"); node.removeAttribute("target"); node.setAttribute("href", "#"); });
  }
  function decorateFormRelatedEditor() {
    if (!["form", "note-form"].includes(state.view) || document.getElementById("form-related-panel")) return;
    const form = document.querySelector("#case-form, #note-form");
    if (!form) return;
    const current = state.view === "form" ? getCase(state.editingId) : getNote(state.noteEditingId);
    const item = current || {id:"", linkedIds:[]};
    form.querySelector(".form-footer")?.insertAdjacentHTML("beforebegin", relatedMarkup(item, true));
  }
  function readRelatedSelection() { return [...document.querySelectorAll("#form-related-panel [data-link-id]:checked")].map(node => node.dataset.linkId); }
  function applyRelatedLinks(item, requestedIds = []) {
    const all = [...state.cases, ...state.notes].filter(entry => !entry.deleted);
    const available = new Set(all.filter(entry => entry.id !== item.id).map(entry => entry.id));
    const nextIds = [...new Set(requestedIds)].filter(id => available.has(id));
    const changed = [];
    const currentIds = [...new Set(item.linkedIds || [])];
    if (JSON.stringify(currentIds) !== JSON.stringify(nextIds)) { item.linkedIds = nextIds; changed.push(item); }
    for (const entry of all) {
      if (entry.id === item.id) continue;
      const shouldLink = nextIds.includes(entry.id);
      const hasLink = (entry.linkedIds || []).includes(item.id);
      if (shouldLink && !hasLink) { entry.linkedIds = [...(entry.linkedIds || []), item.id]; changed.push(entry); }
      if (!shouldLink && hasLink) { entry.linkedIds = (entry.linkedIds || []).filter(id => id !== item.id); changed.push(entry); }
    }
    const now = new Date().toISOString();
    changed.forEach(entry => { entry.updatedAt = now; });
    return changed;
  }
  function syncRelatedChanges(changes = []) { changes.forEach(item => syncItem(state.cases.includes(item) ? "upsertCase" : "upsertNote", item)); }
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
    theme: stored?.theme || "light", pageSize: stored?.pageSize || "20", pendingAttachments: [], pendingAttachmentsReady: false, lightbox: null, cloudinaryOpen: false,
    categoryIcons: stored?.categoryIcons || {}, customTemplates: stored?.customTemplates ?? null, sortOrders: stored?.sortOrders || {}, purgedIds: new Set(stored?.purgedIds || []), formDraft: null, editor: null, richSelection: null
  };

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ cases: state.cases, notes: state.notes, categories: state.categories, theme: state.theme, pageSize: state.pageSize, categoryIcons:state.categoryIcons, customTemplates:state.customTemplates, sortOrders:state.sortOrders, purgedIds:[...state.purgedIds] }));
  async function cloudRequest(payload) {
    if (!APPS_SCRIPT_URL) return null;
    // Keep extended fields in a versioned envelope supported by the existing Sheet schema.
    if (payload.item) { const item = payload.item; payload = { ...payload, item: { ...item, attachments: [...(item.attachments || []).filter(file => file.type !== "itcn-metadata"), {type:"itcn-metadata", version:1, kind:item.kind || (item.status || item.resolution ? "case" : "note"), verifiedAt:item.verifiedAt || null, linkedIds:item.linkedIds || [], referenceUrl:item.referenceUrl || "", color:safeTopicColor(item.color), tags:item.tags || [], configuration:item.configuration || null}] } }; }
    const response = await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Apps Script trả về HTTP ${response.status}`);
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "Apps Script không xử lý được yêu cầu");
    return result;
  }
  const pendingSync = new Map();
  function updateSync(status) {
    cloudState.status = status;
    if (status === "Đã đồng bộ" || status === "Đã tải từ Google Sheet") cloudState.lastSync = new Date();
    document.querySelectorAll(".sync-label").forEach(node => { node.textContent = `${status}${cloudState.lastSync ? ` · ${cloudState.lastSync.toLocaleTimeString("vi-VN")}` : ""}`; });
  }
  function syncItem(action, item) {
    if (!APPS_SCRIPT_URL || !item) return;
    const payload = action === "upsertCategory" ? { action, name: item.name } : { action, item };
    const key = `${action}:${item.id || item.name}`;
    pendingSync.set(key, payload);
    updateSync("Đã lưu trên thiết bị · Đang đồng bộ");
    cloudRequest(payload).then(() => { if (pendingSync.get(key) === payload) pendingSync.delete(key); updateSync(pendingSync.size ? "Còn thay đổi chờ đồng bộ" : "Đã đồng bộ"); }).catch((error) => { updateSync("Lỗi đồng bộ · Có thể thử lại"); console.error(error); toast(`Không thể đồng bộ Google Sheet: ${error.message}`, "error"); });
  }
  async function syncAllToCloud() {
    cloudState.syncing = true;
    cloudState.status = "Đang đồng bộ";
    try {
      for (const name of state.categories) await cloudRequest({ action: "upsertCategory", name });
      for (const item of state.cases) await cloudRequest({ action: "upsertCase", item });
      for (const item of state.notes) await cloudRequest({ action: "upsertNote", item });
      if (state.customTemplates !== null || Object.keys(state.categoryIcons).length) saveConfiguration();
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
        state.cases = Array.isArray(remote.cases) ? remote.cases.map(decodeExtendedItem).filter(item => !state.purgedIds.has(item.id)) : [];
        state.notes = Array.isArray(remote.notes) ? remote.notes.map(decodeExtendedItem).filter(item => !state.purgedIds.has(item.id)) : [];
        const configuration = state.notes.find(item => item.id === "itcn-settings-v1")?.configuration;
        if (configuration) { state.categoryIcons = configuration.categoryIcons || {}; state.customTemplates = configuration.templates ?? null; }
        state.notes = state.notes.filter(item => item.id !== "itcn-settings-v1");
        state.categories = configuration?.categories?.length ? configuration.categories : remote.categories?.length ? remote.categories : defaultCategories;
        state.selectedId = state.cases.find((item) => !item.deleted)?.id || null;
        state.noteSelectedId = state.notes.find((item) => !item.deleted)?.id || null;
        save(); render();
        updateSync("Đã tải từ Google Sheet");
      } else {
        await syncAllToCloud();
        toast("Đã đưa dữ liệu mẫu lên Google Sheet.");
      }
    } catch (error) {
      updateSync("Ngoại tuyến · Dữ liệu trên thiết bị");
      console.error(error);
      toast(`Không tải được dữ liệu Google Sheet: ${error.message}`, "error");
    }
  }
  const activeCases = () => state.cases.filter((item) => !item.deleted);
  const activeNotes = () => state.notes.filter((item) => !item.deleted && (state.knowledgeMode ? item.kind === "knowledge" : item.kind !== "knowledge"));
  const favoriteCases = () => activeCases().filter((item) => item.favorite);
  const favoriteNotes = () => state.notes.filter((item) => !item.deleted && item.favorite);
  const favoriteCount = () => favoriteCases().length + favoriteNotes().length;
  const getCase = (id = state.selectedId) => state.cases.find((item) => item.id === id) || null;
  const getNote = (id = state.noteSelectedId) => state.notes.find((item) => item.id === id) || null;
  const matches = (item, search = state.search) => {
    if (item.deleted) return false;
    const haystack = [item.title, item.category, item.status, item.device, item.os, richTextToPlain(item.symptoms), richTextToPlain(item.cause), richTextToPlain(item.resolution), item.commands, richTextToPlain(item.content), item.noteName, richTextToPlain(item.result), ...(item.tags || [])].join(" ");
    return !search.trim() || normalizeSearch(haystack).includes(normalizeSearch(search.trim()));
  };
  const filteredCases = () => {
    let items = activeCases().filter((item) => matches(item));
    if (state.category !== "Tất cả") items = items.filter((item) => item.category === state.category);
    if (state.status !== "Tất cả") items = items.filter((item) => item.status === state.status);
    if (state.time === "Cũ nhất") items.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (state.time === "Tên A-Z") items.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    else items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return sortItems(items, "cases");
  };
  const filteredNotes = () => {
    let items = activeNotes().filter((item) => {
      const haystack = [item.title, item.category, item.noteName, richTextToPlain(item.content), item.commands, richTextToPlain(item.result), ...(item.tags || [])].join(" ");
      return !state.noteSearch.trim() || normalizeSearch(haystack).includes(normalizeSearch(state.noteSearch.trim()));
    });
    if (state.noteCategory !== "Tất cả") items = items.filter((item) => item.category === state.noteCategory);
    return sortItems(items, state.knowledgeMode ? "knowledge" : "notes");
  };
  const toast = (message, type = "success") => {
    const node = document.createElement("div"); node.className = `toast ${type === "error" ? "error" : ""}`; node.innerHTML = `${icon(type === "error" ? "alert" : "check", 16)}<span>${esc(message)}</span>`;
    document.querySelector("#toast-region").append(node); setTimeout(() => node.remove(), 3200);
  };

  function navButton(view, label, iconName, count = "") {
    return `<button class="nav-button ${state.view === view ? "active" : ""}" data-view="${view}">${icon(iconName, 17)}<span>${label}</span>${count ? `<span class="count">${count}</span>` : ""}</button>`;
  }

  function renderSidebar() {
    const deletedCount = state.cases.filter((item) => item.deleted).length + state.notes.filter((item) => item.deleted).length;
    return `<aside class="sidebar">
      <div class="brand"><span class="brand-mark">${icon("book", 21)}</span><div><strong>IT Case Notes</strong><small>Sổ tay xử lý sự cố IT</small></div></div>
      <nav class="nav" aria-label="Điều hướng chính">
        ${navButton("cases", "Tất cả case", "grid", activeCases().length)}
        ${navButton("notes", "Ghi chú", "book", state.notes.filter(item => !item.deleted && item.kind !== "knowledge").length)}
        ${navButton("knowledge", "Kiến thức", "book", state.notes.filter(item => !item.deleted && item.kind === "knowledge").length)}
        ${navButton("favorites", "Yêu thích", "star", favoriteCount())}
        ${navButton("categories", "Thiết lập", "folder", state.categories.length)}
        ${navButton("settings", "Cài đặt & Sao lưu", "settings", deletedCount ? `${deletedCount} đã xóa` : "")}
      </nav>
      <div class="sidebar-footer">Lưu cục bộ + Google Sheet<br />${cloudState.status} · ${activeCases().length} case đang hoạt động</div>
    </aside>`;
  }

  function tags(tags = []) { return `<div class="tag-row">${tags.map((tag) => `<span class="tag ${tagClass(tag)}">${esc(tag)}</span>`).join("")}</div>`; }

  function caseCard(item) {
    return `<button class="case-card topic-colored ${state.selectedId === item.id ? "selected" : ""}" style="--topic-color:${safeTopicColor(item.color)}" data-select-case="${item.id}">
      <div class="case-card-title">${icon(item.category === "Máy in" ? "printer" : "windows", 17)}<span>${esc(item.title)}</span><span class="star favorite-toggle ${item.favorite ? "" : "off"}" role="button" tabindex="0" aria-label="${item.favorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}" data-action="toggle-case-favorite" data-id="${item.id}">${icon("star", 15)}</span></div>
      ${richTextToPlain(item.symptoms) ? `<p class="case-card-summary">${esc(richTextToPlain(item.symptoms).split("\n")[0])}</p>` : ""}
      <div class="case-card-meta">${tags(item.tags.slice(0, 4))}<span>${formatDate(item.updatedAt)}</span></div>
    </button>`;
  }

  function detailSection(type, title, content, iconName) {
    return `<section class="detail-section ${type}"><div class="section-heading"><span class="section-icon">${icon(iconName, 13)}</span>${title}</div>${content}</section>`;
  }

  function attachmentSource(file) {
    return file?.src || file?.url || "";
  }

  function attachmentsMarkup(files = [], className = "attachments", editable = false) {
    if (!files.length) return "";
    return `<div class="${className}">${files.map((file) => {
      const source = attachmentSource(file);
      const isImage = Boolean(source) && (file.type?.startsWith("image/") || /\.(avif|gif|jpe?g|png|svg|webp)([?#].*)?$/i.test(source) || source.startsWith("data:image/"));
      const alt = file.name || "Ảnh đính kèm";
      const previewAttrs = isImage ? `role="button" tabindex="0" aria-label="Phóng to ${esc(alt)}" data-action="open-image" data-image-src="${esc(source)}" data-image-alt="${esc(alt)}"` : "";
      const removeButton = editable ? `<button type="button" class="attachment-remove" data-action="remove-attachment" data-attachment-index="${files.indexOf(file)}" aria-label="Xóa ${esc(alt)}">${icon("trash", 13)}</button>` : "";
      return `<div class="attachment ${isImage ? "attachment-image" : ""}" ${previewAttrs}>${isImage ? `<img src="${esc(source)}" alt="${esc(alt)}" loading="lazy" />` : `<span>${icon("image", 17)}${esc(alt)}</span>`}${removeButton}</div>`;
    }).join("")}</div>`;
  }

  function attachmentEditor(itemAttachments = [], inputId = "attachment-input", urlInputId = "attachment-url", urlAction = "add-case-attachment-url") {
    const files = state.pendingAttachmentsReady ? state.pendingAttachments : itemAttachments;
    return `<section class="form-section attachment-section"><h3>${icon("image", 16)} Hình ảnh / Tệp đính kèm</h3>
      <label class="dropzone" for="${inputId}">${icon("upload", 24)}<span><strong>Kéo thả file vào đây</strong><small>hoặc chọn file (PNG, JPG, PDF...)</small></span><input id="${inputId}" type="file" multiple accept="image/*,.pdf,.txt,.log" /></label>
      <div class="attachment-url-field"><label for="${urlInputId}">URL hình ảnh</label><div class="attachment-url-row"><input id="${urlInputId}" type="url" placeholder="https://example.com/image.png" /><button type="button" class="button small" data-action="${urlAction}">${icon("plus", 13)} Thêm ảnh</button><a class="button small cloudinary-button" href="https://console.cloudinary.com/console/media_library" target="_blank" rel="noopener noreferrer">${icon("upload", 13)} Cloudinary</a></div><p class="field-help">Có thể mở Cloudinary để tải ảnh lên, sau đó dán Secure URL vào đây.</p></div>
      ${attachmentsMarkup(files, "pending-files", true)}</section>`;
  }

  function formExistingAttachments() {
    return state.view === "note-form" ? getNote(state.noteEditingId)?.attachments || [] : getCase(state.editingId)?.attachments || [];
  }

  function detailPanel(item) {
    if (!item) return `<div id="case-detail-panel" class="panel detail-panel empty" tabindex="-1"><div><div class="empty-icon">${icon("book", 26)}</div><h2>Chọn một case để xem</h2><p>Danh sách case và nội dung xử lý sẽ hiển thị tại đây.</p></div></div>`;
    const steps = (item.resolution || "").split("\n").map((step) => step.trim()).filter(Boolean);
    return `<article id="case-detail-panel" class="panel detail-panel" tabindex="-1">
      <div class="detail-top"><div class="detail-title"><span class="case-icon">${icon(item.category === "Máy in" ? "printer" : "windows", 21)}</span><div><h2>${esc(item.title)}</h2>${tags(item.tags)}</div></div>
        <div class="detail-actions"><button class="button small" data-action="edit-case">${icon("edit", 14)} Chỉnh sửa</button><button class="button small" data-action="duplicate-case">${icon("copy", 14)} Nhân bản</button><button class="button small danger" data-action="delete-case">${icon("trash", 14)} Xóa</button></div></div>
      <div class="info-grid"><div class="info-item"><label>Thiết bị / Phần mềm</label><strong>${esc(item.device || "Chưa cập nhật")}</strong></div><div class="info-item"><label>Hệ điều hành</label><strong>${esc(item.os || "Chưa cập nhật")}</strong></div><div class="info-item"><label>Trạng thái</label><strong>${esc(item.status)}</strong></div><div class="info-item"><label>Cập nhật</label><strong>${formatDateTime(item.updatedAt)}</strong></div></div>
      ${richTextToPlain(item.symptoms) ? detailSection("symptom", "Triệu chứng", richDisplay(item.symptoms), "alert") : ""}
      ${richTextToPlain(item.cause) ? detailSection("cause", "Nguyên nhân", richDisplay(item.cause), "help") : ""}
      ${richTextToPlain(item.resolution) || item.commands?.trim() ? detailSection("resolution", "Các bước xử lý", `${hasRichMarkup(item.resolution) ? richDisplay(item.resolution) : (steps.length ? `<ol class="steps">${steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>` : "")}${item.commands?.trim() ? `<pre class="code-block"><button class="copy-code" data-copy-code="${esc(item.commands)}" title="Sao chép">${icon("copy", 14)}</button>${esc(item.commands)}</pre>` : ""}`, "check") : ""}
      ${richTextToPlain(item.result) || item.attachments?.length ? detailSection("result", "Kết quả / Ghi chú", `${richTextToPlain(item.result) ? richDisplay(item.result) : ""}${attachmentsMarkup(item.attachments || [])}`, "info") : ""}
    </article>`;
  }

  function topHeading(title, subtitle, actions = "") {
    return `<div class="page-heading"><div><p class="eyebrow">IT CASE NOTES</p><h1>${title}</h1><p class="subtle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
  }

  function listToolbar() {
    return `<div class="toolbar"><div class="search-row"><label class="search-input">${icon("search", 17)}<input id="case-search" type="search" value="${esc(state.search)}" placeholder="Tìm lỗi, thiết bị, nguyên nhân, cách xử lý..." aria-label="Tìm kiếm case" /></label><button class="button primary" data-action="search">${icon("search", 15)} Tìm kiếm</button></div><div class="filters"><select class="select" data-filter="category"><option>Tất cả danh mục</option>${state.categories.map((category) => `<option ${state.category === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select><select class="select" data-filter="time"><option>Mới nhất</option><option ${state.time === "Cũ nhất" ? "selected" : ""}>Cũ nhất</option><option ${state.time === "Tên A-Z" ? "selected" : ""}>Tên A-Z</option></select><select class="select" data-filter="status"><option>Tất cả trạng thái</option><option ${state.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option><option ${state.status === "Đang xác minh" ? "selected" : ""}>Đang xác minh</option></select></div></div>`;
  }

  function favoriteGroup(title, iconName, items, card, emptyTitle) {
    return `<section class="panel favorite-group"><div class="favorite-group-heading"><div><h2>${icon(iconName, 17)} ${title}</h2><span>${items.length} mục</span></div></div><div class="case-list">${items.length ? items.map(card).join("") : `<div class="empty compact-empty"><div><div class="empty-icon">${icon(iconName, 22)}</div><h3>${emptyTitle}</h3></div></div>`}</div></section>`;
  }

  function favoritesPage() {
    return `<div class="page favorites-page">${topHeading("Yêu thích", "Tập hợp các case và ghi chú bạn thường xuyên tra cứu", `<span class="favorite-total">${icon("star", 15)} ${favoriteCount()} mục yêu thích</span>`)}<div class="favorites-grid">${favoriteGroup("Case yêu thích", "grid", favoriteCases(), caseCard, "Chưa có case yêu thích")}${favoriteGroup("Ghi chú yêu thích", "book", favoriteNotes(), noteCard, "Chưa có ghi chú yêu thích")}</div></div>`;
  }

  function casesPage() {
    const items = filteredCases();
    const selected = items.some((item) => item.id === state.selectedId) ? getCase() : items[0];
    if (selected && state.selectedId !== selected.id) state.selectedId = selected.id;
    return `<div class="page">${topHeading("Tất cả case", "Tra cứu nhanh nguyên nhân và các bước xử lý sự cố IT", `<button class="button primary" data-action="add-case">${icon("plus", 15)} Thêm case</button>`)}<div class="workspace-grid"><section class="panel list-panel">${listToolbar()}<div class="result-count"><span>${items.length} case${state.search ? ` khớp “${esc(state.search)}”` : ""}</span><span>${icon("archive", 13)} Lưu tự động</span></div><div class="case-list">${items.length ? items.map(caseCard).join("") : `<div class="empty"><div><div class="empty-icon">${icon("search", 24)}</div><h3>Không tìm thấy case</h3><p>Thử từ khóa khác hoặc xóa bộ lọc.</p></div></div>`}</div></section>${detailPanel(selected)}</div></div>`;
  }

  function caseDetailPage() {
    const item = getCase();
    return `<div class="page detail-page">${topHeading("Chi tiết case", "Toàn bộ thông tin và hướng xử lý của case đang chọn", `<button class="button" data-action="back-to-cases">${icon("back", 14)} Quay lại danh sách</button>`)}${detailPanel(item)}</div>`;
  }

  function noteCard(item) {
    return `<button class="case-card note-card topic-colored ${state.noteSelectedId === item.id ? "selected" : ""}" style="--topic-color:${safeTopicColor(item.color)}" data-select-note="${item.id}">
      <div class="case-card-title">${icon("book", 17)}<span>${esc(item.title)}</span><span class="star favorite-toggle ${item.favorite ? "" : "off"}" role="button" tabindex="0" aria-label="${item.favorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}" data-action="toggle-note-favorite" data-id="${item.id}">${icon("star", 15)}</span></div>
      ${(item.noteName?.trim() || richTextToPlain(item.content)) ? `<p class="case-card-summary">${item.noteName?.trim() ? `<strong>${esc(item.noteName)}</strong>` : ""}${item.noteName?.trim() && richTextToPlain(item.content) ? " · " : ""}${richTextToPlain(item.content) ? esc(richTextToPlain(item.content)) : ""}</p>` : ""}
      <div class="case-card-meta">${tags([item.category, ...(item.tags || [])].slice(0, 5))}<span>${formatDate(item.updatedAt)}</span></div>
    </button>`;
  }

  function noteDetailPanel(item) {
    if (!item) return `<div id="note-detail-panel" class="panel detail-panel empty" tabindex="-1"><div><div class="empty-icon">${icon("book", 26)}</div><h2>Chọn một ghi chú để xem</h2><p>Nội dung ghi chú sẽ hiển thị tại đây.</p></div></div>`;
    return `<article id="note-detail-panel" class="panel detail-panel note-detail-panel" tabindex="-1">
      <div class="detail-top"><div class="detail-title"><span class="case-icon">${icon("book", 21)}</span><div><h2>${esc(item.title)}</h2>${tags([item.category, item.noteName, ...(item.tags || [])])}</div></div>
        <div class="detail-actions"><button class="button small ${item.favorite ? "favorite-active" : ""}" data-action="toggle-note-favorite" data-id="${item.id}">${icon("star", 14)} ${item.favorite ? "Bỏ yêu thích" : "Yêu thích"}</button><button class="button small" data-action="edit-note">${icon("edit", 14)} Chỉnh sửa</button><button class="button small" data-action="duplicate-note">${icon("copy", 14)} Nhân bản</button><button class="button small danger" data-action="delete-note">${icon("trash", 14)} Xóa</button></div></div>
      <div class="info-grid"><div class="info-item"><label>Danh mục</label><strong>${esc(item.category)}</strong></div><div class="info-item"><label>Tên ghi chú</label><strong>${esc(item.noteName)}</strong></div><div class="info-item"><label>Tạo ngày</label><strong>${formatDate(item.createdAt)}</strong></div><div class="info-item"><label>Cập nhật</label><strong>${formatDateTime(item.updatedAt)}</strong></div></div>
      ${richTextToPlain(item.content) ? detailSection("note-section note-content-panel", "Nội dung ghi chú", richDisplay(item.content), "book") : ""}
      ${item.commands ? detailSection("note-section note-command-section", "Lệnh CMD / PowerShell", `<pre class="code-block"><button class="copy-code" data-copy-code="${esc(item.commands)}" title="Sao chép">${icon("copy", 14)}</button>${esc(item.commands)}</pre>`, "command") : ""}
      ${richTextToPlain(item.result) || item.attachments?.length ? detailSection("note-section note-result-panel", "Kết quả và ghi chú", `${richTextToPlain(item.result) ? richDisplay(item.result) : ""}${attachmentsMarkup(item.attachments || [], "note-attachments")}`, "info") : ""}
    </article>`;
  }

  function imageLightbox() {
    if (!state.lightbox) return "";
    return `<div class="image-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh phóng to"><div class="image-lightbox-content"><button class="image-lightbox-close" type="button" data-action="close-image" aria-label="Đóng ảnh">×</button><img src="${esc(state.lightbox.src)}" alt="${esc(state.lightbox.alt)}" /></div></div>`;
  }
  function cloudinaryPopup() {
    if (!state.cloudinaryOpen) return "";
    const url = "https://console.cloudinary.com/console/media_library";
    return `<div class="cloudinary-modal" data-action="close-cloudinary" role="dialog" aria-modal="true" aria-labelledby="cloudinary-heading"><section class="cloudinary-dialog"><div class="cloudinary-dialog-heading"><div><p class="eyebrow">IMAGE STORAGE</p><h2 id="cloudinary-heading">Cloudinary</h2></div><button type="button" class="image-lightbox-close" data-action="close-cloudinary" aria-label="Đóng Cloudinary">×</button></div><p class="cloudinary-dialog-help">Tải ảnh lên Cloudinary ngay trong cửa sổ này, sau đó sao chép Secure URL vào ô URL hình ảnh.</p><iframe src="${url}" title="Cloudinary Media Library" loading="lazy"></iframe><div class="cloudinary-dialog-footer"><span>Nếu Cloudinary không cho phép nhúng, hãy mở trang quản lý ở nút bên dưới.</span><a class="button small" href="${url}" target="_blank" rel="noopener noreferrer">Mở Cloudinary riêng</a><button type="button" class="button small primary" data-action="close-cloudinary">Đóng</button></div></section></div>`;
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
    const item = getNote(state.noteEditingId) || { title: "", category: state.categories[0], noteName: "", content: "", commands: "", result: "", color: DEFAULT_TOPIC_COLOR, attachments: [] };
    const isEdit = Boolean(state.noteEditingId);
    return `<div class="page note-form-page">${topHeading(isEdit ? "Chỉnh sửa ghi chú" : "Thêm ghi chú", isEdit ? "Cập nhật nội dung ghi chú và lệnh cần nhớ" : "Lưu nhanh kiến thức hoặc lệnh hỗ trợ IT để tra cứu lại", `<button class="button" data-action="back-to-notes">${icon("back", 14)} Quay lại ghi chú</button>`)}<form id="note-form" class="panel form-panel note-form"><div class="form-layout"><div><section class="form-section"><h3>${icon("book", 16)} Thông tin ghi chú</h3><div class="form-grid"><div class="field full"><label for="note-title">Tiêu đề <span class="required">*</span></label><input id="note-title" required value="${esc(item.title)}" placeholder="Ví dụ: Kiểm tra Print Spooler" /></div><div class="field"><label for="note-category">Danh mục</label><select id="note-category" class="select">${state.categories.map((category) => `<option ${item.category === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></div><div class="field"><label for="note-name">Tên ghi chú <span class="required">*</span></label><input id="note-name" required value="${esc(item.noteName)}" placeholder="Ví dụ: Print Spooler" /></div><div class="field topic-color-field"><label for="topic-color">Màu chủ đề</label><div class="topic-color-control"><input id="topic-color" class="color-picker" type="color" value="${safeTopicColor(item.color)}" /><span>Thẻ bên ngoài sẽ dùng màu này</span></div></div><div class="field full"><label for="note-content">Nội dung ghi chú <span class="optional">(tùy chọn)</span></label><textarea id="note-content" class="tall" placeholder="Ghi nội dung cần nhớ nếu có...">${esc(item.content)}</textarea></div><div class="field full"><label for="note-commands">Lệnh CMD / PowerShell</label><textarea id="note-commands" placeholder="Có thể sao chép trực tiếp khi cần...">${esc(item.commands || "")}</textarea></div><div class="field full"><label for="note-result">Kết quả và ghi chú</label><textarea id="note-result" placeholder="Kết quả, lưu ý hoặc điều kiện áp dụng...">${esc(item.result || "")}</textarea></div></div></section></div><aside class="form-side">${attachmentEditor(item.attachments || [], "note-attachment-input", "note-attachment-url", "add-note-attachment-url")}</aside></div><div class="form-footer"><button type="button" class="button" data-action="back-to-notes">Hủy</button><button type="submit" class="button primary">${icon("check", 15)} ${isEdit ? "Lưu thay đổi" : "Lưu ghi chú"}</button></div></form></div>`;
  }

  function tagsEditor(values = [], editorId = "tag-editor", inputId = "tag-input") {
    return `<div class="tag-input" id="${editorId}">${values.map((tag) => `<span class="tag">${esc(tag)} <button type="button" data-remove-tag="${esc(tag)}" aria-label="Xóa tag">×</button></span>`).join("")}<input id="${inputId}" placeholder="Thêm tag rồi Enter" /></div>`;
  }

  function formPage() {
    const item = getCase(state.editingId) || { title: "", category: state.categories[0], status: "Đang xác minh", device: "", os: "", symptoms: "", cause: "", resolution: "", commands: "", result: "", color: DEFAULT_TOPIC_COLOR, tags: [], attachments: [] };
    const isEdit = Boolean(state.editingId);
    return `<div class="page">${topHeading(isEdit ? "Chỉnh sửa case" : "Thêm case mới", isEdit ? "Cập nhật nguyên nhân, giải pháp hoặc ghi chú cho case" : "Ghi lại sự cố và các bước xử lý để dùng lại sau này", `<button class="button" data-action="cancel-form">${icon("back", 14)} Quay lại</button>`)}<form id="case-form" class="panel form-panel"><div class="form-layout"><div><section class="form-section"><h3>${icon("info", 16)} Thông tin case</h3><div class="form-grid"><div class="field full"><label for="title">Tiêu đề <span class="required">*</span></label><input id="title" required value="${esc(item.title)}" placeholder="Ví dụ: Không thể kết nối máy in qua USB" /></div><div class="field"><label for="category">Danh mục <span class="required">*</span></label><select id="category" class="select" required>${state.categories.map((category) => `<option ${item.category === category ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></div><div class="field"><label for="status">Trạng thái</label><select id="status" class="select"><option ${item.status === "Đang xác minh" ? "selected" : ""}>Đang xác minh</option><option ${item.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option></select></div><div class="field topic-color-field"><label for="topic-color">Màu chủ đề</label><div class="topic-color-control"><input id="topic-color" class="color-picker" type="color" value="${safeTopicColor(item.color)}" /><span>Thẻ bên ngoài sẽ dùng màu này</span></div></div><div class="field"><label for="device">Thiết bị / Phần mềm</label><input id="device" value="${esc(item.device)}" placeholder="HP M211dw, Outlook..." /></div><div class="field"><label for="os">Hệ điều hành</label><input id="os" value="${esc(item.os)}" placeholder="Windows 11 25H2" /></div><div class="field full"><label for="symptoms">Triệu chứng <span class="optional">(tùy chọn)</span></label><textarea id="symptoms" placeholder="Mô tả dấu hiệu, thông báo lỗi nếu có...">${esc(item.symptoms)}</textarea></div><div class="field full"><label for="cause">Nguyên nhân</label><textarea id="cause" placeholder="Có thể ghi nguyên nhân chưa xác minh để cập nhật sau...">${esc(item.cause)}</textarea></div></div></section><section class="form-section"><h3>${icon("check", 16)} Cách xử lý <span class="optional">(tùy chọn)</span></h3><div class="field"><label for="resolution">Các bước xử lý (mỗi dòng là một bước)</label><textarea id="resolution" class="tall" placeholder="1. Kiểm tra...\n2. Cài lại...">${esc(item.resolution)}</textarea></div><div class="field" style="margin-top:13px"><label for="commands">Lệnh CMD / PowerShell</label><textarea id="commands" placeholder="Có thể sao chép trực tiếp khi xử lý...">${esc(item.commands || "")}</textarea></div></section><section class="form-section"><h3>${icon("info", 16)} Kết quả và ghi chú</h3><div class="field"><label for="result">Kết quả / Ghi chú</label><textarea id="result" placeholder="Kết quả sau khi xử lý, lưu ý cho lần sau...">${esc(item.result || "")}</textarea></div></section></div><aside class="form-side"><section class="form-section"><h3>${icon("folder", 16)} Tag / Từ khóa</h3><div class="field">${tagsEditor(item.tags || [])}<p class="field-help">Tag giúp tìm kiếm case nhanh hơn.</p></div></section>${attachmentEditor(item.attachments || [])}</aside></div><div class="form-footer"><button type="button" class="button" data-action="cancel-form">Hủy</button><button type="submit" class="button primary">${icon("check", 15)} ${isEdit ? "Lưu thay đổi" : "Lưu case"}</button></div></form></div>`;
  }

  function searchPage() {
    const items = filteredCases();
    return `<div class="page search-page">${topHeading("Tìm kiếm case", "Tìm toàn văn trên tiêu đề, triệu chứng, nguyên nhân, giải pháp, tag và mã lỗi")}<div class="search-hero"><label class="search-input">${icon("search", 18)}<input id="global-search" type="search" value="${esc(state.search)}" placeholder="Ví dụ: Unspecified, Print Spooler, HP M211dw..." /></label><button class="button primary" data-action="search">${icon("search", 15)} Tìm kiếm</button></div><div class="result-count" style="padding-left:0"><span>${items.length} kết quả</span><span>Không cần bấm Enter, kết quả cập nhật tức thời</span></div><div class="search-results">${items.length ? items.map((item) => `<article class="search-result" data-select-case="${item.id}"><span class="case-icon">${icon(item.category === "Máy in" ? "printer" : "windows", 19)}</span><div><h3>${esc(item.title)}</h3>${richTextToPlain(item.symptoms) ? `<p>${esc(richTextToPlain(item.symptoms).split("\n")[0])}</p>` : ""}${tags(item.tags)}</div><small class="subtle">${formatDate(item.updatedAt)}</small></article>`).join("") : `<div class="panel empty"><div><div class="empty-icon">${icon("search", 24)}</div><h3>Chưa có kết quả phù hợp</h3><p>Thử tên thiết bị, mã lỗi hoặc một từ khóa trong cách xử lý.</p></div></div>`}</div></div>`;
  }

  function categoriesPage() {
    return `<div class="page">${topHeading("Danh mục", "Nhóm case theo hệ điều hành, thiết bị, phần mềm và loại sự cố", `<button class="button primary" data-action="add-category">${icon("plus", 15)} Thêm danh mục</button>`)}<div class="categories-grid">${state.categories.map((category, index) => { const count = activeCases().filter((item) => item.category === category).length; return `<article class="category-card"><span class="category-color" style="background:${categoryColors[index % categoryColors.length]}">${icon(index < 2 ? "windows" : "folder", 18)}</span><div class="category-info"><strong>${esc(category)}</strong><small>${count} case</small></div><button class="more" data-edit-category="${esc(category)}" aria-label="Tùy chọn ${esc(category)}">${icon("more", 17)}</button></article>`; }).join("")}</div></div>`;
  }

  function settingsPage() {
    const deletedCases = state.cases.filter((item) => item.deleted);
    const deletedNotes = state.notes.filter((item) => item.deleted);
    const deleted = [...deletedCases.map((item) => `<div class="trash-row"><div><strong>${esc(item.title)}</strong><small>Case · Xóa lần cuối: ${formatDate(item.updatedAt)}</small></div><div class="trash-actions"><button class="button small" data-restore-case="${item.id}">${icon("refresh", 13)} Khôi phục</button><button class="button small danger" data-delete-trash-case="${item.id}">${icon("trash", 13)} Xóa vĩnh viễn</button></div></div>`), ...deletedNotes.map((item) => `<div class="trash-row"><div><strong>${esc(item.title)}</strong><small>${item.kind === "knowledge" ? "Kiến thức" : "Ghi chú"} · Xóa lần cuối: ${formatDate(item.updatedAt)}</small></div><div class="trash-actions"><button class="button small" data-restore-note="${item.id}">${icon("refresh", 13)} Khôi phục</button><button class="button small danger" data-delete-trash-note="${item.id}">${icon("trash", 13)} Xóa vĩnh viễn</button></div></div>`)].join("");
    const deletedCount = deletedCases.length + deletedNotes.length;
    return `<div class="page">${topHeading("Cài đặt & Sao lưu", "Bảo vệ dữ liệu cục bộ và điều chỉnh cách hiển thị sổ tay")}
      <div class="settings-grid"><section class="settings-card"><h3>${icon("archive", 18)} Sao lưu dữ liệu</h3><p>Xuất toàn bộ case, danh mục, tag và ảnh đính kèm thành một file JSON để lưu trữ hoặc chuyển sang máy khác.</p><button class="button primary" data-action="export">${icon("download", 15)} Xuất bản sao</button><div class="setting-row"><span>Khôi phục dữ liệu</span><button class="button small" data-action="import">${icon("upload", 13)} Chọn file khôi phục</button></div><input id="settings-import" class="sr-only" type="file" accept="application/json,.json" /></section>
      <section class="settings-card"><h3>${icon("palette", 18)} Giao diện</h3><p>Tùy chỉnh giao diện và số lượng case hiển thị trong danh sách.</p><div class="setting-row"><span>Chế độ màu</span><select class="select" style="width:130px" data-setting="theme"><option value="light" ${state.theme === "light" ? "selected" : ""}>Sáng (Light)</option><option value="dark" ${state.theme === "dark" ? "selected" : ""}>Tối (Dark)</option></select></div><div class="setting-row"><span>Số case hiển thị</span><select class="select" style="width:130px" data-setting="pageSize"><option ${state.pageSize === "20" ? "selected" : ""}>20 case / trang</option><option ${state.pageSize === "50" ? "selected" : ""}>50 case / trang</option></select></div></section>
      <section class="settings-card" style="grid-column:1/-1"><div class="setup-heading"><h3>${icon("trash", 18)} Thùng rác ${deletedCount ? `<span class="tag red">${deletedCount}</span>` : ""}</h3>${deletedCount ? `<button class="button small danger" data-action="empty-trash">${icon("trash", 13)} Xóa nhanh tất cả</button>` : ""}</div><p>Case và ghi chú đã xóa mềm được giữ lại để khôi phục khi cần.</p>${deletedCount ? `<div class="trash-list">${deleted}</div>` : `<span class="subtle">Thùng rác đang trống.</span>`}</section></div></div>`;
  }

  function normalizeSearch(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase(); }
  function commandPanel(value) {
    return `<div class="command-list"><div class="command-heading">CMD / PowerShell <button class="button small" data-copy-code="${esc(value)}">Sao chép tất cả</button></div>${value.split("\n").filter(line => line.trim()).map(line => `<div class="command-line"><code>${esc(line)}</code><button class="button small" data-copy-code="${esc(line)}" aria-label="Sao chép lệnh ${esc(line)}">Sao chép</button></div>`).join("")}</div>`;
  }
  function unifiedSearchPage() {
    const cases = activeCases().filter(item => matches(item));
    const notes = state.notes.filter(item => !item.deleted && matches(item));
    const group = (title, items, kind) => `<section class="search-group"><h2>${title} (${items.length})</h2>${items.map(item => `<button class="search-hit" data-select-${kind}="${esc(item.id)}"><strong>${esc(item.title)}</strong><span>${esc(item.category)} · ${esc((richTextToPlain(item.symptoms) || richTextToPlain(item.content) || item.noteName || "").slice(0,180))}</span></button>`).join("") || '<p>Không có kết quả phù hợp.</p>'}</section>`;
    return `<div class="page">${topHeading("Tìm kiếm chung", "Tra cứu case, ghi chú và lệnh; hỗ trợ từ khóa không dấu")}<label class="search-input"><input id="global-search" aria-label="Tìm kiếm chung" type="search" value="${esc(state.search)}" placeholder="Nhập lỗi, thiết bị, lệnh hoặc nội dung..." /></label>${group("Case", cases, "case")}${group("Ghi chú", notes, "note")}</div>`;
  }
  function decodeExtendedItem(item) {
    const metadata = (item.attachments || []).find(file => file.type === "itcn-metadata");
    const isCase = Boolean(item.status || item.symptoms || item.resolution);
    return {...item, ...(metadata ? {kind:metadata.kind, verifiedAt:isCase ? metadata.verifiedAt : null, linkedIds:metadata.linkedIds, referenceUrl:metadata.referenceUrl || "", color:safeTopicColor(metadata.color || item.color), tags:metadata.tags || item.tags || [], configuration:metadata.configuration} : {color:safeTopicColor(item.color), tags:item.tags || []}), attachments:(item.attachments || []).filter(file => file.type !== "itcn-metadata")};
  }
  const caseTemplates = {
    "Máy in": {symptoms:"Model máy in:\nKết nối USB / LAN:\nThông báo lỗi:", resolution:"Kiểm tra nguồn và kết nối máy in.\nKiểm tra hàng đợi và Print Spooler.\nKiểm tra driver đúng model.\nIn trang thử và xác nhận với người dùng."},
    "Mạng / Internet": {symptoms:"Thiết bị:\nIP / DNS / Gateway:\nPhạm vi ảnh hưởng:\nThông báo lỗi:", resolution:"Kiểm tra cáp hoặc Wi-Fi.\nKiểm tra IP, DNS và gateway.\nKiểm tra truy cập nội bộ và Internet.\nXác nhận kết nối sau xử lý."},
    "Microsoft 365": {symptoms:"Ứng dụng và phiên bản:\nThông báo lỗi:\nThời điểm bắt đầu:", resolution:"Kiểm tra tài khoản và giấy phép.\nKiểm tra đăng nhập trên trình duyệt.\nKiểm tra cấu hình ứng dụng.\nThử lại chức năng và xác nhận kết quả."},
    "Windows": {symptoms:"Phiên bản Windows:\nThiết bị:\nMã lỗi:\nThay đổi gần nhất:", resolution:"Ghi nhận lỗi và phạm vi ảnh hưởng.\nKiểm tra cập nhật và nhật ký hệ thống.\nThực hiện biện pháp phù hợp.\nKhởi động lại nếu cần và kiểm tra kết quả."}
  };
  function recentItems() { try { return JSON.parse(localStorage.getItem("itcn-recent") || "[]"); } catch { return []; } }
  const sortLabels = {"created-desc":"Ngày tạo: mới nhất", "created-asc":"Ngày tạo: cũ nhất", "title-asc":"Tên: A–Z", "title-desc":"Tên: Z–A", "category-asc":"Danh mục: A–Z", "category-desc":"Danh mục: Z–A"};
  function sortItems(items, key) {
    const [field, direction] = (state.sortOrders[key] || "created-desc").split("-");
    return items.sort((a,b) => {
      const comparison = field === "created" ? (new Date(a.createdAt).getTime() || 0) - (new Date(b.createdAt).getTime() || 0) : String(a[field] || "").localeCompare(String(b[field] || ""), "vi", {numeric:true, sensitivity:"base"});
      return comparison * (direction === "desc" ? -1 : 1) || String(a.title).localeCompare(String(b.title), "vi");
    });
  }
  function availableTemplates() { return state.customTemplates ?? Object.entries(caseTemplates).map(([name,fields]) => ({id:name,name,category:name,fields})); }
  function saveConfiguration() {
    save();
    const now = new Date().toISOString();
    syncItem("upsertNote", {id:"itcn-settings-v1",title:"Thiết lập ứng dụng",category:"",noteName:"",content:"",commands:"",result:"",favorite:false,deleted:true,createdAt:now,updatedAt:now,attachments:[],kind:"configuration",configuration:{categories:state.categories,categoryIcons:state.categoryIcons,templates:state.customTemplates}});
  }
  const categoryIconChoices = {windows:"Windows",printer:"Máy in",network:"Mạng",computer:"Máy tính",shield:"Bảo mật",mail:"Email",software:"Phần mềm",database:"Cơ sở dữ liệu",folder:"Thư mục"};
  Object.assign(iconPaths, {
    network:'<circle cx="12" cy="5" r="3"/><path d="M12 8v5M4 13h16M4 13v4M20 13v4"/><rect x="1" y="17" width="6" height="5"/><rect x="17" y="17" width="6" height="5"/>',
    computer:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4M7 21h10"/>',
    shield:'<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6z"/>',
    mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 5 10 8L22 5"/>',
    software:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m10 8-4 4 4 4m4-8 4 4-4 4"/>',
    database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>'
  });
  function categoryIcon(name) { return state.categoryIcons[name] || (name === "Windows" ? "windows" : name === "Máy in" ? "printer" : "folder"); }
  function setupPage() {
    return `<div class="page">${topHeading("Thiết lập", "Quản lý danh mục và các mẫu ghi nhận sự cố")}<section class="setup-section"><div class="setup-heading"><h2>Danh mục</h2><button class="button primary" data-action="new-category">Thêm danh mục</button></div><div class="categories-grid">${state.categories.map((name,index) => `<article class="category-card"><span class="category-color" style="background:${categoryColors[index % categoryColors.length]}">${icon(categoryIcon(name))}</span><div class="category-info"><strong>${esc(name)}</strong><small>${activeCases().filter(item => item.category === name).length} case</small></div><button class="button small" data-edit-category-new="${esc(name)}">Chỉnh sửa</button><button class="button small danger" data-delete-category="${esc(name)}" aria-label="Xóa danh mục ${esc(name)}">Xóa</button></article>`).join("")}</div></section><section class="setup-section"><div class="setup-heading"><h2>Mẫu case</h2><button class="button primary" data-action="new-template">Thêm mẫu case</button></div><div class="template-grid">${availableTemplates().map(template => `<article class="settings-card"><h3>${esc(template.name)}</h3><span class="tag">${esc(template.category)}</span><p class="template-preview">${esc(template.fields.symptoms || template.fields.resolution || "Chưa có nội dung")}</p><button class="button" data-edit-template="${esc(template.id)}">Chỉnh sửa</button> <button class="button danger" data-delete-template="${esc(template.id)}">Xóa</button></article>`).join("") || '<p>Chưa có mẫu case. Bấm Thêm mẫu case để tạo.</p>'}</div></section></div>`;
  }
  function settingsEditor() {
    const editor = state.editor;
    const template = editor.type === "template" ? availableTemplates().find(item => item.id === editor.id) : null;
    const fields = template?.fields || {};
    const input = (id,label,value="",multiline=false) => `<div class="field"><label for="${id}">${label}</label>${multiline ? `<textarea id="${id}">${esc(value)}</textarea>` : `<input id="${id}" required value="${esc(value)}" />`}</div>`;
    const content = editor.type === "category" ? `${input("config-name","Tên danh mục",editor.name || "")}<fieldset class="icon-picker"><legend>Chọn icon</legend>${Object.entries(categoryIconChoices).map(([key,label]) => `<label><input type="radio" name="category-icon" value="${key}" ${categoryIcon(editor.name) === key ? "checked" : ""}/>${icon(key)} ${label}</label>`).join("")}</fieldset>` : `${input("config-name","Tên mẫu case",template?.name)}<div class="field"><label for="config-category">Danh mục</label><select id="config-category" class="select">${state.categories.map(name => `<option ${name === template?.category ? "selected" : ""}>${esc(name)}</option>`).join("")}</select></div>${[["device","Thiết bị / Phần mềm"],["os","Hệ điều hành"],["symptoms","Triệu chứng"],["cause","Nguyên nhân"],["resolution","Các bước xử lý"],["commands","Lệnh CMD / PowerShell"],["result","Kết quả / Ghi chú"]].map(([key,label]) => input(`template-${key}`,label,fields[key] || "",true)).join("")}`;
    return `<div class="config-overlay"><section role="dialog" aria-modal="true" aria-labelledby="config-heading" class="config-dialog"><h2 id="config-heading">${editor.type === "category" ? "Danh mục" : "Mẫu case"}</h2><form id="configuration-form">${content}<div class="form-footer"><button type="button" class="button" data-action="close-config">Hủy</button><button class="button primary" type="submit">Lưu</button></div></form></section></div>`;
  }
  function safeReference(value) { try {const url = new URL(value); return ["https:","http:"].includes(url.protocol) ? url.href : "";} catch {return "";} }
  function decorateNewFeatures() {
    const key = state.view === "cases" ? "cases" : state.view === "notes" ? (state.knowledgeMode ? "knowledge" : "notes") : null;
    if (key) {
      document.querySelector('[data-filter="time"]')?.remove();
      document.querySelector('.filters')?.insertAdjacentHTML('beforeend', `<select class="select" aria-label="Sắp xếp danh sách" data-sort-key="${key}">${Object.entries(sortLabels).map(([value,label]) => `<option value="${value}" ${(state.sortOrders[key] || "created-desc") === value ? "selected" : ""}>${label}</option>`).join("")}</select>`);
    }
    if (state.view === "form" && !document.getElementById("reference-url")) {
      document.querySelector('#case-form #result')?.closest('.form-section')?.insertAdjacentHTML('afterend', `<div class="field full reference-url-field"><label for="reference-url">URL trang web tham khảo <span class="optional">(tùy chọn)</span></label><input id="reference-url" type="url" value="${esc(getCase(state.editingId)?.referenceUrl || "")}" placeholder="https://..." /><small>Chỉ hiển thị ở chi tiết khi đã nhập URL.</small></div>`);
    }
    if (state.view === "note-form" && !document.getElementById("reference-url")) {
      document.querySelector('#note-content')?.closest('.field')?.insertAdjacentHTML('afterend', `<div class="field full reference-url-field"><label for="reference-url">URL trang web tham khảo <span class="optional">(tùy chọn)</span></label><input id="reference-url" type="url" value="${esc(getNote(state.noteEditingId)?.referenceUrl || "")}" placeholder="https://..." /><small>Chỉ hiển thị ở chi tiết khi đã nhập URL.</small></div>`);
    }
    document.querySelectorAll('[data-select-case]').forEach(card => {const item = getCase(card.dataset.selectCase); const svg = card.querySelector('.case-card-title > svg'); if(item && svg) svg.outerHTML = icon(categoryIcon(item.category),17);});
  }
  function rememberItem(type, id) { const items = recentItems().filter(item => item.id !== id); items.unshift({type,id,viewedAt:new Date().toISOString()}); localStorage.setItem("itcn-recent", JSON.stringify(items.slice(0,12))); }
  function legacyRelatedMarkup(item) {
    const all = [...state.cases, ...state.notes].filter(entry => !entry.deleted && entry.id !== item.id);
    return `<section class="related-panel"><h3>Nội dung liên quan</h3>${(item.linkedIds || []).map(id => all.find(entry => entry.id === id)).filter(Boolean).map(entry => `<button class="button" data-open-related="${esc(entry.id)}">${esc(entry.title)}</button>`).join("") || '<p>Chưa có liên kết.</p>'}<button class="button small" data-action="manage-links">Chỉnh liên kết</button><div class="link-editor" hidden>${all.map(entry => `<label><input type="checkbox" data-link-id="${esc(entry.id)}" ${(item.linkedIds || []).includes(entry.id) ? "checked" : ""} /> ${esc(entry.title)}</label>`).join("")}<button class="button primary" data-action="save-links">Lưu liên kết</button></div></section>`;
  }
  function activeRelatedEntries(item) { return [...state.cases, ...state.notes].filter(entry => !entry.deleted && entry.id !== item.id); }
  function validLinkedIds(item, entries = activeRelatedEntries(item)) { const available = new Set(entries.map(entry => entry.id)); return [...new Set(item.linkedIds || [])].filter(id => available.has(id)); }
  function filterRelatedOptions(value = "") {
    const term = normalizeSearch(value.trim());
    document.querySelectorAll("[data-related-option]").forEach(option => {
      const selected = Boolean(option.querySelector("[data-link-id]")?.checked);
      const visible = term ? option.dataset.search.includes(term) : selected;
      option.hidden = !visible;
      option.style.display = visible ? "flex" : "none";
    });
  }
  function legacyRelatedMarkupV2(item) {
    const all = activeRelatedEntries(item);
    const linkedIds = validLinkedIds(item, all);
    const linked = linkedIds.map(id => all.find(entry => entry.id === id)).filter(Boolean);
    const options = all.map(entry => {
      const selected = linkedIds.includes(entry.id);
      const searchText = normalizeSearch(`${entry.title} ${entry.category} ${entry.noteName || ""} ${richTextToPlain(entry.content)} ${(entry.tags || []).join(" ")}`);
      return `<label class="related-option" data-related-option data-search="${esc(searchText)}" style="display:${selected ? "flex" : "none"}"><input type="checkbox" data-link-id="${esc(entry.id)}" ${selected ? "checked" : ""} /> <span><strong>${esc(entry.title)}</strong><small>${esc(entry.category)}${entry.noteName ? ` · ${esc(entry.noteName)}` : ""}${entry.kind === "knowledge" ? " · Kiến thức" : ""}${entry.tags?.length ? ` · ${esc(entry.tags.join(", "))}` : ""}</small></span></label>`;
    }).join("");
    return `<section class="related-panel"><div class="related-heading"><h3>Nội dung liên quan</h3><span class="subtle">${linked.length} topic</span></div><div class="related-current">${linked.map(entry => `<button class="button" data-open-related="${esc(entry.id)}">${esc(entry.title)}</button>`).join("") || '<p>Chưa có liên kết.</p>'}</div><button class="button small" data-action="manage-links">Chọn nội dung liên quan</button><div class="link-editor" hidden><label class="search-input related-search-input">${icon("search", 16)}<input id="related-search" type="search" placeholder="Tìm topic theo tên hoặc danh mục..." aria-label="Tìm topic liên quan" /></label><div class="related-options">${options || '<p class="subtle">Chưa có topic khác để liên kết.</p>'}</div><button class="button primary" data-action="save-links">Lưu liên kết</button></div></section>`;
  }
  function relatedMarkup(item, editable = false) {
    const all = activeRelatedEntries(item);
    const linkedIds = validLinkedIds(item, all);
    const linked = linkedIds.map(id => all.find(entry => entry.id === id)).filter(Boolean);
    if (!editable && !linked.length) return "";
    const options = all.map(entry => {
      const selected = linkedIds.includes(entry.id);
      const searchText = normalizeSearch(`${entry.title} ${entry.category} ${entry.noteName || ""} ${richTextToPlain(entry.content)} ${(entry.tags || []).join(" ")}`);
      return `<label class="related-option" data-related-option data-search="${esc(searchText)}" style="display:${selected ? "flex" : "none"}"><input type="checkbox" data-link-id="${esc(entry.id)}" ${selected ? "checked" : ""} /> <span><strong>${esc(entry.title)}</strong><small>${esc(entry.category)}${entry.noteName ? ` · ${esc(entry.noteName)}` : ""}${entry.kind === "knowledge" ? " · Kiến thức" : ""}${entry.tags?.length ? ` · ${esc(entry.tags.join(", "))}` : ""}</small></span></label>`;
    }).join("");
    if (!editable) return `<section class="related-panel"><div class="related-heading"><h3>Nội dung liên quan</h3><span class="subtle">${linked.length} topic</span></div><div class="related-current">${linked.map(entry => `<button class="button" data-open-related="${esc(entry.id)}">${esc(entry.title)}</button>`).join("")}</div></section>`;
    return `<section id="form-related-panel" class="related-panel form-related-panel"><div class="related-heading"><h3>Nội dung liên quan</h3><span class="subtle">${linked.length} topic đã chọn</span></div><p class="field-help">Nhập từ khóa để tìm và chọn Case, ghi chú hoặc kiến thức liên quan.</p><label class="search-input related-search-input">${icon("search", 16)}<input id="related-search" type="search" placeholder="Tìm theo tên, nội dung, danh mục hoặc tag..." aria-label="Tìm topic liên quan" /></label><div class="related-options">${options || '<p class="subtle">Chưa có topic khác để liên kết.</p>'}</div></section>`;
  }
  function render() {
    if (state.view === "knowledge") { state.knowledgeMode = true; state.view = "notes"; }
    if (state.view === "note-detail") state.knowledgeMode = getNote()?.kind === "knowledge";
    document.documentElement.dataset.theme = state.theme;
    const page = state.view === "form" ? formPage() : state.view === "detail" ? caseDetailPage() : state.view === "note-form" ? noteFormPage() : state.view === "note-detail" ? noteDetailPage() : state.view === "notes" ? notesPage() : state.view === "favorites" ? favoritesPage() : state.view === "search" ? searchPage() : state.view === "categories" ? setupPage() : state.view === "settings" ? settingsPage() : casesPage();
    document.querySelector("#app").innerHTML = `${renderSidebar()}<main class="main"><div class="utility-bar"><button class="button" data-view="search">${icon("search", 16)} Tìm case & ghi chú</button><div class="sync-status" role="status"><span class="sync-label">${esc(cloudState.status)}${cloudState.lastSync ? ` · ${cloudState.lastSync.toLocaleTimeString("vi-VN")}` : ""}</span><button class="button small" data-action="retry-sync">Thử lại</button></div></div>${state.view === "search" ? unifiedSearchPage() : page}</main>${imageLightbox()}${cloudinaryPopup()}`;
    document.querySelectorAll(".code-block").forEach(node => { const value = node.querySelector("[data-copy-code]")?.dataset.copyCode; if (value) node.outerHTML = commandPanel(value); });
    document.querySelectorAll('#note-detail-panel .detail-actions [data-action="toggle-note-favorite"]').forEach(node => node.remove());
    document.querySelectorAll(".steps li").forEach(node => { const text = node.textContent.replace(/^\s*\d+[.)\s-]+/, ""); node.innerHTML = `<label><input type="checkbox" /> <span>${esc(text)}</span></label>`; });
    decorateWorkspace();
    decorateNewFeatures();
    decorateFormRelatedEditor();
    decorateNoteTags();
    decorateTopicColorPicker();
    decorateRichEditors();
    decorateCloudinaryButtons();
    restoreFormDraft();
    if (state.editor) document.querySelector('main').insertAdjacentHTML('beforeend', settingsEditor());
  }
  function decorateWorkspace() {
    if (state.knowledgeMode && ["notes","note-form","note-detail"].includes(state.view)) {
      document.querySelectorAll('.nav-button').forEach(node => node.classList.toggle("active", node.dataset.view === "knowledge"));
      const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT); let node;
      while ((node = walker.nextNode())) if (!node.parentElement.closest('textarea,code,pre,.case-card-summary,.detail-section p,h2')) node.textContent = node.textContent.replace(/ghi chú/g,"kiến thức").replace(/Ghi chú/g,"Kiến thức");
      ["note-commands","note-result"].forEach(id => document.getElementById(id)?.closest('.field')?.remove());
      const result = document.querySelector('.note-result-panel'); if(result) { result.innerHTML = `<h3>Hình ảnh / Tệp đính kèm</h3>${attachmentsMarkup(getNote()?.attachments || [])}`; }
      document.querySelector('.note-command-section')?.remove();
    }
    const form = document.querySelector('#case-form');
    if (form) form.insertAdjacentHTML('afterbegin', `<div class="template-picker"><label>Mẫu case theo danh mục <select id="case-template" class="select"><option value="">Chọn mẫu...</option>${availableTemplates().map(template => `<option value="${esc(template.id)}">${esc(template.name)} · ${esc(template.category)}</option>`).join("")}</select></label><button type="button" class="button" data-action="apply-template">Áp dụng mẫu</button><small>Áp dụng sẽ thay các trường có nội dung trong mẫu sau khi xác nhận.</small></div>`);
    const detail = document.querySelector('#case-detail-panel:not(.empty), #note-detail-panel:not(.empty)');
    document.querySelectorAll('[data-select-case],[data-select-note]').forEach(card => {
      const item = card.dataset.selectCase ? getCase(card.dataset.selectCase) : getNote(card.dataset.selectNote);
      if (item?.verifiedAt && card.dataset.selectCase) card.querySelector('.favorite-toggle')?.insertAdjacentHTML('beforebegin', '<span class="tag green verified-badge">✓ Đã kiểm chứng</span>');
    });
    if (detail) {
      const item = detail.id === "case-detail-panel" ? getCase() : getNote();
      const url = safeReference(item?.referenceUrl);
      if (url && !detail.querySelector('.reference-panel')) {
        const anchor = detail.querySelector('.note-content-panel') || detail.querySelector('.detail-section.result') || detail.querySelector('.info-grid') || detail.querySelector('.detail-top');
        anchor?.insertAdjacentHTML('afterend', `<section class="reference-panel"><h3>Trang web tham khảo</h3><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url)} · Mở tab mới</a><button class="button" data-action="embed-reference" data-url="${esc(url)}">Xem trang nhúng</button><p>Một số website chặn nhúng. Nếu khung trống hoặc báo lỗi, hãy dùng Mở tab mới.</p><div id="reference-frame"></div></section>`);
      }
      detail.insertAdjacentHTML('beforeend', relatedMarkup(item));
      if (detail.id === "case-detail-panel") detail.insertAdjacentHTML('beforeend', `<div class="verification"><span>${item.verifiedAt ? `✓ Đã kiểm chứng · ${formatDateTime(item.verifiedAt)}` : 'Chưa kiểm chứng'}</span><button class="button small" data-action="verify-item">${item.verifiedAt ? 'Bỏ kiểm chứng' : 'Đánh dấu đã kiểm chứng'}</button></div>`);
    }
    if (["cases","notes"].includes(state.view)) {
      const recent = recentItems().map(ref => ({...ref,item:[...state.cases,...state.notes].find(item => item.id === ref.id && !item.deleted)})).filter(ref => ref.item);
      document.querySelector('.page')?.insertAdjacentHTML('beforeend', `<section class="recent-panel"><h2>Đã xem gần đây</h2>${recent.map(ref => `<button class="button" data-open-related="${esc(ref.id)}">${esc(ref.item.title)}</button>`).join("") || '<p>Nội dung bạn mở sẽ xuất hiện tại đây.</p>'}</section>`);
    }
  }

  function focusSearch(id = "case-search") { const input = document.getElementById(id); if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } }
  function formFieldValue(id) {
    const editor = document.querySelector(`[contenteditable="true"][data-rich-editor="${CSS.escape(id)}"]`);
    return editor ? sanitizeRichHtml(editor.innerHTML) : document.getElementById(id)?.value?.trim() || "";
  }
  function setFormFieldValue(id, value = "") {
    const editor = document.querySelector(`[contenteditable="true"][data-rich-editor="${CSS.escape(id)}"]`);
    const field = document.getElementById(id);
    if (editor) editor.innerHTML = richHtml(value); else if (field) field.value = value;
  }
  function formData() {
    const field = (id) => formFieldValue(id);
    return { title: field("title"), category: field("category"), status: field("status"), device: field("device"), os: field("os"), symptoms: field("symptoms"), cause: field("cause"), resolution: field("resolution"), commands: field("commands"), result: field("result"), referenceUrl: field("reference-url"), color: safeTopicColor(document.getElementById("topic-color")?.value), tags: [...document.querySelectorAll("#tag-editor .tag")].map((node) => node.textContent.replace("×", "").trim()), linkedIds: readRelatedSelection(), attachments: state.pendingAttachmentsReady ? state.pendingAttachments : formExistingAttachments(), attachmentsTouched: state.pendingAttachmentsReady };
  }
  function saveForm(event) {
    event.preventDefault();
    const data = formData();
    if (data.referenceUrl && !safeReference(data.referenceUrl)) { toast("URL phải bắt đầu bằng http:// hoặc https://.", "error"); return; }
    if (!data.title || !data.category) { toast("Vui lòng điền tiêu đề và danh mục.", "error"); return; }
    const now = new Date().toISOString();
    let savedItem; let relationChanges = [];
    if (state.editingId) {
      const index = state.cases.findIndex((item) => item.id === state.editingId);
      state.cases[index] = { ...state.cases[index], ...data, attachments: data.attachmentsTouched ? data.attachments : state.cases[index].attachments || [], updatedAt: now };
      savedItem = state.cases[index]; relationChanges = applyRelatedLinks(savedItem, data.linkedIds);
      state.selectedId = state.editingId; toast("Đã lưu thay đổi cho case.");
    } else {
      const item = { ...data, id: uid(), favorite: false, deleted: false, createdAt: now, updatedAt: now, attachments: data.attachments || [] };
      state.cases.unshift(item); savedItem = item; relationChanges = applyRelatedLinks(item, data.linkedIds); state.selectedId = item.id; toast("Đã thêm case mới.");
    }
    state.pendingAttachments = []; state.pendingAttachmentsReady = false; state.editingId = null; state.view = "cases"; save(); render();
    syncRelatedChanges(relationChanges);
    if (!relationChanges.includes(savedItem)) syncItem("upsertCase", savedItem);
  }
  function noteFormData() {
    const field = (id) => formFieldValue(id);
    return { title: field("note-title"), category: field("note-category"), noteName: field("note-name"), content: field("note-content"), commands: field("note-commands"), result: field("note-result"), referenceUrl: field("reference-url"), color: safeTopicColor(document.getElementById("topic-color")?.value), tags: [...document.querySelectorAll("#note-tag-editor .tag")].map((node) => node.textContent.replace("×", "").trim()), linkedIds: readRelatedSelection(), attachments: state.pendingAttachmentsReady ? state.pendingAttachments : formExistingAttachments(), attachmentsTouched: state.pendingAttachmentsReady };
  }
  function captureFormDraft() {
    const ids = ["title", "category", "status", "device", "os", "symptoms", "cause", "resolution", "commands", "result", "reference-url", "topic-color", "note-title", "note-category", "note-name", "note-content", "note-commands", "note-result"];
    state.formDraft = {values:Object.fromEntries(ids.map(id => [id, formFieldValue(id)]).filter(([, value]) => value !== "")), tags:[...document.querySelectorAll("#tag-editor .tag, #note-tag-editor .tag")].map(node => node.textContent.replace("×", "").trim()), relatedIds:readRelatedSelection()};
  }
  function restoreFormDraft() {
    if (!state.formDraft) return;
    const values = state.formDraft.values || state.formDraft;
    for (const [id, value] of Object.entries(values)) {
      const editor = document.querySelector(`[contenteditable="true"][data-rich-editor="${CSS.escape(id)}"]`);
      const field = document.getElementById(id);
      if (editor) editor.innerHTML = richHtml(value);
      else if (field) field.value = value;
    }
    const tagEditor = document.querySelector("#tag-editor, #note-tag-editor");
    if (tagEditor && Array.isArray(state.formDraft.tags)) {
      tagEditor.querySelectorAll(".tag").forEach(node => node.remove());
      const input = tagEditor.querySelector("input");
      state.formDraft.tags.forEach(tag => { const node = document.createElement("span"); node.className = "tag"; node.innerHTML = `${esc(tag)} <button type="button" data-remove-tag="${esc(tag)}" aria-label="Xóa tag">×</button>`; tagEditor.insertBefore(node, input); });
    }
    const topicInput = document.getElementById("topic-color");
    if (topicInput) document.querySelectorAll("[data-topic-color]").forEach(node => { const active = node.dataset.topicColor.toLowerCase() === topicInput.value.toLowerCase(); node.classList.toggle("active", active); node.setAttribute("aria-pressed", String(active)); });
    if (Array.isArray(state.formDraft.relatedIds)) {
      document.querySelectorAll("#form-related-panel [data-link-id]").forEach(node => { node.checked = state.formDraft.relatedIds.includes(node.dataset.linkId); });
      filterRelatedOptions(document.getElementById("related-search")?.value || "");
    }
    state.formDraft = null;
  }
  function saveNoteForm(event) {
    event.preventDefault();
    const data = noteFormData();
    if (data.referenceUrl && !safeReference(data.referenceUrl)) { toast("URL phải bắt đầu bằng http:// hoặc https://.", "error"); return; }
    data.kind = state.knowledgeMode ? "knowledge" : "note";
    if (!data.title || !data.noteName) { toast("Vui lòng điền tiêu đề và tên ghi chú.", "error"); return; }
    const now = new Date().toISOString();
    let savedItem; let relationChanges = [];
    if (state.noteEditingId) {
      const index = state.notes.findIndex((item) => item.id === state.noteEditingId);
      state.notes[index] = { ...state.notes[index], ...data, attachments: data.attachmentsTouched ? data.attachments : state.notes[index].attachments || [], updatedAt: now };
      savedItem = state.notes[index]; relationChanges = applyRelatedLinks(savedItem, data.linkedIds);
      state.noteSelectedId = state.noteEditingId; toast("Đã lưu thay đổi cho ghi chú.");
    } else {
      const item = { ...data, id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, favorite: false, createdAt: now, updatedAt: now, deleted: false, attachments: data.attachments || [] };
      state.notes.unshift(item); savedItem = item; relationChanges = applyRelatedLinks(item, data.linkedIds); state.noteSelectedId = item.id; toast("Đã thêm ghi chú mới.");
    }
    state.pendingAttachments = []; state.pendingAttachmentsReady = false; state.noteEditingId = null; state.view = "notes"; save(); render();
    syncRelatedChanges(relationChanges);
    if (!relationChanges.includes(savedItem)) syncItem("upsertNote", savedItem);
  }
  function rememberRichSelection(editor) {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editor.contains(selection.anchorNode)) return;
    state.richSelection = {id: editor.dataset.richEditor, range: selection.getRangeAt(0).cloneRange()};
  }
  function runRichCommand(editorId, command, value = null) {
    const editor = document.querySelector(`[contenteditable="true"][data-rich-editor="${CSS.escape(editorId)}"]`);
    if (!editor) return;
    editor.focus();
    if (state.richSelection?.id === editorId) {
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(state.richSelection.range);
    }
    try { document.execCommand(command, false, value); } catch { /* Unsupported browser command; leave content unchanged. */ }
    rememberRichSelection(editor);
  }
  function parseTagsInput(event) {
    const input = event.target; if (event.key !== "Enter") return; event.preventDefault(); const value = input.value.trim(); if (!value) return; const editor = input.closest(".tag-input"); if (editor.querySelector(`[data-remove-tag="${CSS.escape(value)}"]`)) return; const tag = document.createElement("span"); tag.className = "tag"; tag.innerHTML = `${esc(value)} <button type="button" data-remove-tag="${esc(value)}" aria-label="Xóa tag">×</button>`; editor.insertBefore(tag, input); input.value = "";
  }
  async function readAttachments(files) {
    captureFormDraft();
    const selected = [...files].slice(0, 6);
    const existing = state.pendingAttachmentsReady ? state.pendingAttachments : formExistingAttachments();
    state.pendingAttachments = [...existing];
    state.pendingAttachmentsReady = true;
    for (const file of selected) {
      const src = file.type.startsWith("image/") ? await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }) : "";
      state.pendingAttachments.push({ name: file.name, src });
    }
    render(); toast(`${state.pendingAttachments.length} tệp đã sẵn sàng đính kèm.`);
  }

  function addAttachmentUrl(inputId) {
    captureFormDraft();
    const input = document.getElementById(inputId);
    const url = input?.value.trim() || "";
    if (!/^https?:\/\/[^\s]+$/i.test(url)) {
      toast("Vui lòng nhập URL hình ảnh hợp lệ.", "error");
      return;
    }
    const existing = state.pendingAttachmentsReady ? state.pendingAttachments : formExistingAttachments();
    const name = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "Ảnh từ URL");
    state.pendingAttachmentsReady = true;
    state.pendingAttachments = [...existing, { name, src: url, url, type: "image/url" }];
    render();
    toast("Đã thêm ảnh từ URL.");
  }
  function exportData() {
    const payload = { format: "IT Case Notes backup", version: 3, exportedAt: new Date().toISOString(), categories: state.categories, cases: state.cases, notes: state.notes, categoryIcons:state.categoryIcons, customTemplates:state.customTemplates };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `it-case-notes-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); toast("Đã xuất bản sao dữ liệu.");
  }
  function importData(file) {
    const reader = new FileReader(); reader.onload = () => { try { const payload = JSON.parse(reader.result); if (!Array.isArray(payload.cases) || !Array.isArray(payload.categories)) throw new Error("invalid"); state.cases = payload.cases; state.notes = Array.isArray(payload.notes) ? payload.notes : []; state.categories = payload.categories; state.categoryIcons = payload.categoryIcons || {}; state.customTemplates = payload.customTemplates ?? null; state.purgedIds = new Set(); state.selectedId = state.cases.find((item) => !item.deleted)?.id || null; state.noteSelectedId = state.notes.find((item) => !item.deleted)?.id || null; save(); saveConfiguration(); render(); syncAllToCloud().then(() => toast("Đã khôi phục và đồng bộ dữ liệu lên Google Sheet.")).catch((error) => toast(`Đã khôi phục cục bộ nhưng đồng bộ thất bại: ${error.message}`, "error")); } catch { toast("File sao lưu không đúng định dạng IT Case Notes.", "error"); } }; reader.readAsText(file);
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
    rememberItem("case", id);
    state.selectedId = id; state.view = "detail"; render(); focusPanel("case-detail-panel");
  };
  const openNoteDetail = (id) => {
    clearTimeout(noteSelectionTimer);
    rememberItem("note", id);
    state.noteSelectedId = id; state.view = "note-detail"; render(); focusPanel("note-detail-panel");
  };

  function toggleFavorite(type, id) {
    const collection = type === "note" ? state.notes : state.cases;
    const item = collection.find((entry) => entry.id === id);
    if (!item || item.deleted) return;
    item.favorite = !item.favorite;
    save(); render();
    syncItem(type === "note" ? "upsertNote" : "upsertCase", item);
    toast(item.favorite ? "Đã thêm vào yêu thích." : "Đã bỏ khỏi yêu thích.");
  }

  function duplicateNote() {
    const original = getNote();
    if (!original) return;
    const now = new Date().toISOString();
    const copy = { ...original, id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title: `${original.title} (Bản sao)`, favorite: false, deleted: false, createdAt: now, updatedAt: now, attachments: [...(original.attachments || [])] };
    state.notes.unshift(copy); state.noteSelectedId = copy.id; state.view = "note-detail"; save(); render(); syncItem("upsertNote", copy); toast("Đã nhân bản ghi chú.");
  }

  function pruneLinkedReferences(deletedId) {
    const now = new Date().toISOString();
    for (const entry of [...state.cases, ...state.notes]) {
      if (entry.id === deletedId || entry.deleted || !(entry.linkedIds || []).includes(deletedId)) continue;
      entry.linkedIds = (entry.linkedIds || []).filter(id => id !== deletedId);
      entry.updatedAt = now;
      syncItem(state.cases.includes(entry) ? "upsertCase" : "upsertNote", entry);
    }
  }

  function deleteNote() {
    const item = getNote();
    if (!item) return;
    item.deleted = true; item.favorite = false; item.updatedAt = new Date().toISOString();
    pruneLinkedReferences(item.id);
    state.noteSelectedId = activeNotes()[0]?.id || null; state.view = "notes"; save(); render(); syncItem("upsertNote", item); toast("Đã chuyển ghi chú vào thùng rác.");
  }

  function permanentlyDeleteTrash(type, id) {
    const collection = type === "case" ? state.cases : state.notes;
    const item = collection.find(entry => entry.id === id && entry.deleted);
    if (!item) return;
    state.purgedIds.add(id);
    pruneLinkedReferences(id);
    syncItem(type === "case" ? "upsertCase" : "upsertNote", item);
    if (type === "case") state.cases = state.cases.filter(entry => entry.id !== id);
    else state.notes = state.notes.filter(entry => entry.id !== id);
    if (state.selectedId === id) state.selectedId = activeCases()[0]?.id || null;
    if (state.noteSelectedId === id) state.noteSelectedId = activeNotes()[0]?.id || null;
    save(); render(); toast("Đã xóa vĩnh viễn khỏi thùng rác.");
  }

  function emptyTrash() {
    const deletedCases = state.cases.filter(item => item.deleted);
    const deletedNotes = state.notes.filter(item => item.deleted);
    if (!deletedCases.length && !deletedNotes.length) return;
    for (const item of deletedCases) { state.purgedIds.add(item.id); pruneLinkedReferences(item.id); syncItem("upsertCase", item); }
    for (const item of deletedNotes) { state.purgedIds.add(item.id); pruneLinkedReferences(item.id); syncItem("upsertNote", item); }
    state.cases = state.cases.filter(item => !item.deleted);
    state.notes = state.notes.filter(item => !item.deleted);
    state.selectedId = activeCases()[0]?.id || null;
    state.noteSelectedId = activeNotes()[0]?.id || null;
    save(); render(); toast(`Đã xóa ${deletedCases.length + deletedNotes.length} mục khỏi thùng rác.`);
  }

  document.addEventListener("click", (event) => {
    const topicColor = event.target.closest("[data-topic-color]");
    if (topicColor) {
      const input = document.getElementById("topic-color");
      if (input) {
        input.value = safeTopicColor(topicColor.dataset.topicColor);
        document.querySelectorAll("[data-topic-color]").forEach(node => { const active = node.dataset.topicColor.toLowerCase() === input.value.toLowerCase(); node.classList.toggle("active", active); node.setAttribute("aria-pressed", String(active)); });
      }
      return;
    }
    const richTool = event.target.closest("[data-rich-command]");
    if (richTool?.tagName === "BUTTON") { runRichCommand(richTool.dataset.richEditor, richTool.dataset.richCommand, richTool.dataset.richValue || null); return; }
    const actionTarget = event.target.closest("[data-action]");
    const action = actionTarget?.dataset.action;
    if (action === "open-cloudinary") { event.preventDefault(); if (document.querySelector("#case-form, #note-form")) captureFormDraft(); state.cloudinaryOpen = true; render(); return; }
    if (action === "close-cloudinary" || event.target.classList.contains("cloudinary-modal")) { if (document.querySelector("#case-form, #note-form")) captureFormDraft(); state.cloudinaryOpen = false; render(); return; }
    if (action === "embed-reference") {
      const url = safeReference(actionTarget.dataset.url); if (!url) return;
      const frame = document.createElement('iframe'); frame.src = url; frame.title = "Trang web tham khảo"; frame.referrerPolicy = "no-referrer"; frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups'); frame.loading = "lazy";
      document.getElementById('reference-frame').replaceChildren(frame); actionTarget.disabled = true; return;
    }
    if (action === "new-category" || action === "new-template") { state.editor = {type:action === "new-category" ? "category" : "template"}; render(); return; }
    if (action === "close-config") {state.editor = null; render(); return;}
    const editCategoryNew = event.target.closest('[data-edit-category-new]');
    if(editCategoryNew) {state.editor={type:"category",name:editCategoryNew.dataset.editCategoryNew}; render(); return;}
    const deleteCategory = event.target.closest('[data-delete-category]');
    if(deleteCategory) {
      const name = deleteCategory.dataset.deleteCategory;
      if (name === "Khác") { toast("Không thể xóa danh mục mặc định Khác.", "error"); return; }
      const used = [...state.cases, ...state.notes].filter(item => !item.deleted && item.category === name);
      if (!confirm(`${used.length ? `Có ${used.length} nội dung đang dùng danh mục này. Chuyển sang Khác rồi ` : ""}xóa danh mục “${name}”?`)) return;
      if (used.length && !state.categories.includes("Khác")) state.categories.push("Khác");
      for (const item of used) { item.category = "Khác"; item.updatedAt = new Date().toISOString(); syncItem(state.cases.includes(item) ? "upsertCase" : "upsertNote", item); }
      state.customTemplates = availableTemplates().map(template => ({...template, category: template.category === name ? "Khác" : template.category}));
      state.categories = state.categories.filter(category => category !== name); delete state.categoryIcons[name];
      saveConfiguration(); render(); toast("Đã xóa danh mục."); return;
    }
    const editTemplate = event.target.closest('[data-edit-template]');
    if(editTemplate) {state.editor={type:"template",id:editTemplate.dataset.editTemplate}; render(); return;}
    const deleteTemplate = event.target.closest('[data-delete-template]');
    if(deleteTemplate) {if(confirm('Xóa mẫu case này? Các case đã tạo sẽ được giữ lại.')) {state.customTemplates = availableTemplates().filter(item => item.id !== deleteTemplate.dataset.deleteTemplate); saveConfiguration(); render();} return;}
    const related = event.target.closest('[data-open-related]');
    if (related) { const id = related.dataset.openRelated; if (state.cases.some(item => item.id === id)) openCaseDetail(id); else openNoteDetail(id); return; }
    if (action === "apply-template") { const id = document.getElementById('case-template').value; const template = availableTemplates().find(item => item.id === id); if (!template) return; if (Object.keys(template.fields).some(key => formFieldValue(key)) && !confirm('Thay nội dung các trường bằng mẫu đã chọn?')) return; setFormFieldValue('category', template.category); for (const [key,value] of Object.entries(template.fields)) setFormFieldValue(key, value); return; }
    if (action === "manage-links") { const editor = document.querySelector('.link-editor'); if (editor) { editor.hidden = false; filterRelatedOptions(""); document.getElementById('related-search')?.focus(); } return; }
    if (action === "save-links" || action === "verify-item") {
      const isCase = Boolean(document.getElementById('case-detail-panel')); const item = isCase ? getCase() : getNote(); if (!item) return;
      let relationChanges = [];
      if(action === "save-links") relationChanges = applyRelatedLinks(item, [...document.querySelectorAll('[data-link-id]:checked')].map(node => node.dataset.linkId));
      else item.verifiedAt = item.verifiedAt ? null : new Date().toISOString();
      item.updatedAt = new Date().toISOString(); save(); render(); syncRelatedChanges(relationChanges); if (!relationChanges.includes(item)) syncItem(isCase ? 'upsertCase' : 'upsertNote', item); return;
    }
    if (action === "retry-sync") { for (const payload of pendingSync.values()) syncItem(payload.action, payload.item || {name: payload.name}); if (!pendingSync.size) hydrateFromCloud(); return; }
    if (action === "empty-trash") { if (confirm("Xóa vĩnh viễn toàn bộ case và ghi chú trong thùng rác?")) emptyTrash(); return; }
    if (action === "remove-attachment") {
      event.preventDefault(); event.stopPropagation();
      captureFormDraft();
      const current = state.pendingAttachmentsReady ? [...state.pendingAttachments] : [...formExistingAttachments()];
      current.splice(Number(actionTarget.dataset.attachmentIndex), 1);
      state.pendingAttachments = current; state.pendingAttachmentsReady = true; render(); toast("Đã bỏ tệp đính kèm khỏi biểu mẫu."); return;
    }
    if (event.target.classList.contains("image-lightbox") || action === "close-image") { state.lightbox = null; render(); return; }
    if (action === "open-image") { state.lightbox = { src: actionTarget.dataset.imageSrc, alt: actionTarget.dataset.imageAlt || "Ảnh đính kèm" }; render(); return; }
    if (action === "toggle-case-favorite" || action === "toggle-note-favorite") { event.preventDefault(); event.stopPropagation(); toggleFavorite(action === "toggle-note-favorite" ? "note" : "case", actionTarget.dataset.id); return; }
    const view = event.target.closest("[data-view]"); if (view) { state.knowledgeMode = view.dataset.view === "knowledge"; state.view = view.dataset.view; render(); return; }
    const select = event.target.closest("[data-select-case]"); if (select) {
      const id = select.dataset.selectCase;
      if (state.view === "search" || window.matchMedia("(max-width: 820px)").matches) { openCaseDetail(id); return; }
      if (event.detail >= 2) { openCaseDetail(id); return; }
      clearTimeout(caseSelectionTimer);
      state.selectedId = id;
      if (state.view === "search") state.view = "cases";
      render();
      return;
    }
    const noteSelect = event.target.closest("[data-select-note]"); if (noteSelect) {
      const id = noteSelect.dataset.selectNote;
      if (state.view === "search" || window.matchMedia("(max-width: 820px)").matches) { openNoteDetail(id); return; }
      if (event.detail >= 2) { openNoteDetail(id); return; }
      clearTimeout(noteSelectionTimer);
      state.noteSelectedId = id;
      render();
      return;
    }
    if (action === "add-case") { state.view = "form"; state.editingId = null; state.pendingAttachments = []; state.pendingAttachmentsReady = false; render(); return; }
    if (action === "add-case-attachment-url") { addAttachmentUrl("attachment-url"); return; }
    if (action === "add-note-attachment-url") { addAttachmentUrl("note-attachment-url"); return; }
    if (action === "cancel-form") { state.view = "cases"; state.editingId = null; state.pendingAttachments = []; state.pendingAttachmentsReady = false; render(); return; }
    if (action === "back-to-cases") { state.view = "cases"; render(); return; }
    if (action === "add-note") { state.view = "note-form"; state.noteEditingId = null; state.pendingAttachments = []; state.pendingAttachmentsReady = false; render(); return; }
    if (action === "back-to-notes") { state.view = "notes"; state.noteEditingId = null; state.pendingAttachments = []; state.pendingAttachmentsReady = false; render(); return; }
    if (action === "edit-note") { state.view = "note-form"; state.noteEditingId = state.noteSelectedId; state.pendingAttachments = []; state.pendingAttachmentsReady = false; render(); return; }
    if (action === "duplicate-note") { duplicateNote(); return; }
    if (action === "delete-note") { deleteNote(); return; }
    if (action === "search-notes") { state.noteSearch = document.getElementById("note-search")?.value || state.noteSearch; state.view = "notes"; render(); return; }
    if (action === "edit-case") { state.view = "form"; state.editingId = state.selectedId; state.pendingAttachments = []; state.pendingAttachmentsReady = false; render(); return; }
    if (action === "duplicate-case") { const original = getCase(); if (!original) return; const now = new Date().toISOString(); const copy = { ...original, id: uid(), title: `${original.title} (Bản sao)`, favorite: false, deleted: false, createdAt: now, updatedAt: now }; state.cases.unshift(copy); state.selectedId = copy.id; save(); render(); syncItem("upsertCase", copy); toast("Đã nhân bản case."); return; }
    if (action === "delete-case") { const item = getCase(); if (!item) return; item.deleted = true; item.updatedAt = new Date().toISOString(); pruneLinkedReferences(item.id); state.selectedId = activeCases()[0]?.id || null; save(); render(); syncItem("upsertCase", item); toast("Đã chuyển case vào thùng rác."); return; }
    if (action === "search") { state.search = document.getElementById("case-search")?.value || document.getElementById("global-search")?.value || state.search; state.view = state.view === "search" ? "search" : "cases"; render(); return; }
    if (action === "export") { exportData(); return; }
    if (action === "import") { document.getElementById("settings-import")?.click(); return; }
    if (action === "add-category") { const value = window.prompt("Tên danh mục mới:"); if (value?.trim() && !state.categories.includes(value.trim())) { state.categories.push(value.trim()); save(); render(); syncItem("upsertCategory", { name: value.trim() }); toast("Đã thêm danh mục."); } return; }
    if (event.target.closest("[data-copy-code]")) { navigator.clipboard?.writeText(event.target.closest("[data-copy-code]").dataset.copyCode); toast("Đã sao chép lệnh."); return; }
    const restore = event.target.closest("[data-restore-case]"); if (restore) { const item = getCase(restore.dataset.restoreCase); if (item) { item.deleted = false; item.updatedAt = new Date().toISOString(); save(); render(); syncItem("upsertCase", item); toast("Đã khôi phục case."); } return; }
    const restoreNote = event.target.closest("[data-restore-note]"); if (restoreNote) { const item = getNote(restoreNote.dataset.restoreNote); if (item) { item.deleted = false; item.updatedAt = new Date().toISOString(); save(); render(); syncItem("upsertNote", item); toast("Đã khôi phục ghi chú."); } return; }
    const deleteTrashCase = event.target.closest("[data-delete-trash-case]"); if (deleteTrashCase) { if (confirm("Xóa vĩnh viễn case này?")) permanentlyDeleteTrash("case", deleteTrashCase.dataset.deleteTrashCase); return; }
    const deleteTrashNote = event.target.closest("[data-delete-trash-note]"); if (deleteTrashNote) { if (confirm("Xóa vĩnh viễn ghi chú này?")) permanentlyDeleteTrash("note", deleteTrashNote.dataset.deleteTrashNote); return; }
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
    if (event.target.id === "related-search") {
      filterRelatedOptions(event.target.value);
    }
  });
  document.addEventListener("mousedown", (event) => {
    const tool = event.target.closest("[data-rich-command]");
    if (tool) {
      const editor = document.querySelector(`[contenteditable="true"][data-rich-editor="${CSS.escape(tool.dataset.richEditor)}"]`);
      if (editor) rememberRichSelection(editor);
      if (tool.tagName === "BUTTON") event.preventDefault();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.lightbox) { state.lightbox = null; render(); return; }
    if (event.key === "Escape" && state.cloudinaryOpen) { state.cloudinaryOpen = false; render(); return; }
    const actionTarget = event.target.closest("[data-action]");
    if ((event.key === "Enter" || event.key === " ") && actionTarget && ["toggle-case-favorite", "toggle-note-favorite", "open-image", "close-image"].includes(actionTarget.dataset.action)) { event.preventDefault(); actionTarget.click(); return; }
    if (event.target.closest(".tag-input")) parseTagsInput(event);
    if (event.key === "Enter" && (event.target.id === "case-search" || event.target.id === "global-search")) { event.preventDefault(); state.search = event.target.value; render(); }
    if (event.key === "Enter" && event.target.id === "note-search") { event.preventDefault(); state.noteSearch = event.target.value; render(); }
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-rich-command]")) { runRichCommand(event.target.dataset.richEditor, event.target.dataset.richCommand, event.target.value || null); event.target.value = ""; return; }
    if (event.target.matches("[data-link-id]")) { filterRelatedOptions(document.getElementById("related-search")?.value || ""); return; }
    if (event.target.dataset.sortKey) {state.sortOrders[event.target.dataset.sortKey] = event.target.value; save(); render(); return;}
    if (event.target.dataset.filter === "category") { state.category = event.target.value === "Tất cả danh mục" ? "Tất cả" : event.target.value; render(); }
    if (event.target.dataset.filter === "status") { state.status = event.target.value === "Tất cả trạng thái" ? "Tất cả" : event.target.value; render(); }
    if (event.target.dataset.filter === "time") { state.time = event.target.value; render(); }
    if (event.target.dataset.noteFilter === "category") { state.noteCategory = event.target.value === "Tất cả danh mục" ? "Tất cả" : event.target.value; render(); }
    if (event.target.dataset.setting === "theme") { state.theme = event.target.value; save(); render(); }
    if (event.target.dataset.setting === "pageSize") { state.pageSize = event.target.value.startsWith("50") ? "50" : "20"; save(); toast("Đã cập nhật tùy chọn hiển thị."); }
    if (event.target.id === "attachment-input" && event.target.files.length) readAttachments(event.target.files);
    if (event.target.id === "settings-import" && event.target.files.length) importData(event.target.files[0]);
  });
  document.addEventListener("submit", (event) => {
    if (event.target.id === "case-form") saveForm(event);
    if (event.target.id === "note-form") saveNoteForm(event);
    if (event.target.id === "configuration-form") {
      event.preventDefault(); const name = document.getElementById('config-name').value.trim(); if(!name) return;
      if(state.editor.type === "category") {
        const old = state.editor.name;
        if(state.categories.includes(name) && name !== old) {toast('Tên danh mục đã tồn tại.', 'error'); return;}
        if(old) state.categories = state.categories.map(value => value === old ? name : value); else state.categories.push(name);
        state.categoryIcons[name] = document.querySelector('[name="category-icon"]:checked')?.value || 'folder';
        if(old && old !== name) {
          delete state.categoryIcons[old];
          for(const item of [...state.cases,...state.notes]) if(item.category === old) {item.category = name; item.updatedAt = new Date().toISOString(); syncItem(state.cases.includes(item) ? 'upsertCase' : 'upsertNote',item);}
          state.customTemplates = availableTemplates().map(template => ({...template,category:template.category === old ? name : template.category}));
        }
        syncItem('upsertCategory',{name});
      } else {
        const fields = {}; for(const key of ['device','os','symptoms','cause','resolution','commands','result']) {const value = document.getElementById(`template-${key}`).value.trim(); if(value) fields[key] = value;}
        const template = {id:state.editor.id || `template-${Date.now()}`,name,category:document.getElementById('config-category').value,fields};
        const templates = availableTemplates(); state.customTemplates = [...templates.filter(item => item.id !== template.id),template];
      }
      state.editor = null; saveConfiguration(); render(); toast('Đã lưu thiết lập.');
    }
  });
  save(); render();
  hydrateFromCloud();
})();
