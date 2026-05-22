// ===============================
// 📦 LOCAL DATABASE (OFFLINE)
// ===============================
const offlineDB = localforage.createInstance({
  name: "ENQUETE_OFFLINE_DB"
});

// ===============================
// 🚨 SUBMIT LOCK
// ===============================
let isSubmitting = false;

// ===============================
// 💾 SAVE OFFLINE DATA
// ===============================
async function saveOffline(data) {

  const key = "offline_" + Date.now();

  await offlineDB.setItem(key, data);

  console.log("📦 SAVED LOCAL:", key);
}

// ===============================
// 🔄 SYNC OFFLINE → FIREBASE
// ===============================
async function syncOfflineData() {

  if (!navigator.onLine) return;

  console.log("🔄 START SYNC");

  const keys = await offlineDB.keys();

  for (const key of keys) {

    try {

      const data = await offlineDB.getItem(key);

      if (!data) continue;

      data.date = new Date();

      await db.collection("membres").add(data);

      await offlineDB.removeItem(key);

      console.log("✅ SYNC OK:", data.nom);

    } catch (e) {

      console.log("❌ SYNC ERROR:", e);
    }
  }

  console.log("🔄 END SYNC");
}

// ===============================
// 🌐 AUTO SYNC WHEN BACK ONLINE
// ===============================
window.addEventListener("online", () => {

  console.log("🌐 INTERNET BACK");

  setTimeout(() => {
    syncOfflineData();
  }, 2000);
});

// ===============================
// 🔁 PERIODIC SYNC LOOP
// ===============================
setInterval(() => {

  if (navigator.onLine) {
    syncOfflineData();
  }

}, 5000);

// ===============================
// 🚀 MAIN FUNCTION (SUBMIT FORM)
// ===============================
async function envoyer() {

  if (isSubmitting) return;

  isSubmitting = true;

  try {

    const get = (id) =>
      document.getElementById(id)?.value?.trim() || "";

    const data = {

      nom: get("nom"),
      origine: get("origine"),
      fonenana: get("fonenana"),
      categorie: document.getElementById("categorie")?.value || "",
      asa: document.getElementById("asa")?.value || "",
      telephone: get("telephone"),
      about: get("about"),

      date: new Date()
    };

    // ===============================
    // VALIDATION
    // ===============================
    if (
      !data.nom ||
      !data.origine ||
      !data.fonenana ||
      !data.categorie ||
      !data.asa ||
      !data.telephone
    ) {

      alert("Fenoy daholo ny saha rehetra!");

      isSubmitting = false;
      return;
    }

    // ===============================
    // OFFLINE MODE
    // ===============================
    if (!navigator.onLine) {

      await saveOffline(data);

      alert("⚠️ Tsy misy internet.\nVoatahiry aloha.");

      clearForm();

      isSubmitting = false;

      return;
    }

    // ===============================
    // ONLINE MODE
    // ===============================
    await db.collection("membres").add(data);

    alert("✅ Vita soa aman-tsara!");

    clearForm();

  } catch (e) {

    console.log("❌ ERROR:", e);

    try {

      const get = (id) =>
        document.getElementById(id)?.value?.trim() || "";

      const backupData = {

        nom: get("nom"),
        origine: get("origine"),
        fonenana: get("fonenana"),
        categorie: document.getElementById("categorie")?.value || "",
        asa: document.getElementById("asa")?.value || "",
        telephone: get("telephone"),
        about: get("about"),

        date: new Date()
      };

      await saveOffline(backupData);

      alert("⚠️ Problème internet.\nVoatahiry local.");

      clearForm();

    } catch (err) {

      console.log("❌ LOCAL SAVE FAIL:", err);
    }

  }

  isSubmitting = false;
}

// ===============================
// 🧹 CLEAR FORM
// ===============================
function clearForm() {

  ["nom", "origine", "fonenana", "telephone", "about"]
    .forEach(id => {

      const el = document.getElementById(id);

      if (el) el.value = "";
    });

  const c = document.getElementById("categorie");
  const a = document.getElementById("asa");

  if (c) c.selectedIndex = 0;
  if (a) a.selectedIndex = 0;
}

// ===============================
// 🌐 NAVIGATION
// ===============================
function ouvrirDashboard() {

  window.location.href = "dashboard.html";
}