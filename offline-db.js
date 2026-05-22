// Instance local database
const offlineDB = localforage.createInstance({
    name: "ENQUETE_OFFLINE_DB"
});


// ==========================
// 💾 SAVE DATA OFFLINE
// ==========================
async function saveOffline(data) {

    const key = Date.now().toString();

    await offlineDB.setItem(key, {
        ...data,
        synced: false,
        createdAt: new Date().toISOString()
    });

}


// ==========================
// 📥 GET ALL OFFLINE DATA
// ==========================
async function getOfflineData() {

    const items = [];

    await offlineDB.iterate((value, key) => {
        items.push({ key, ...value });
    });

    return items;
}


// ==========================
// 🧹 DELETE AFTER SYNC (optional)
// ==========================
async function deleteOffline(key) {
    await offlineDB.removeItem(key);
}