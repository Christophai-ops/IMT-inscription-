
// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBzxmeM4xeKZ8S897l-troTlhyb9LAG-4A",
  authDomain: "enquete-app-afa39.firebaseapp.com",
  projectId: "enquete-app-afa39",
  storageBucket: "enquete-app-afa39.firebasestorage.app",
  messagingSenderId: "9596134822",
  appId: "1:9596134822:web:5e39a1ff2910a8da685b67"
};

// ⚠️ SAFE INIT
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

////////////////////////////////////////////////////////////////////////////////
// 🔒 ANTI MULTI SUBMIT
////////////////////////////////////////////////////////////////////////////////
let isSubmitting = false;

////////////////////////////////////////////////////////////////////////////////
// 📦 DATA CACHE LOCAL (IMPORTANT FOR PERFORMANCE)
////////////////////////////////////////////////////////////////////////////////
let allData = [];

////////////////////////////////////////////////////////////////////////////////
// 🔥 ENVOYER FORMULAIRE
////////////////////////////////////////////////////////////////////////////////
async function envoyer() {

  if (isSubmitting) return;
  isSubmitting = true;

  try {

    let nom = document.getElementById("nom")?.value.trim();
    let origine = document.getElementById("origine")?.value.trim();
    let fonenana = document.getElementById("fonenana")?.value.trim();
    let categorie = document.getElementById("categorie")?.value;
    let asa = document.getElementById("asa")?.value;
    let telephone = document.getElementById("telephone")?.value.trim();
    let about = document.getElementById("about")?.value?.trim() || "";

    if (!nom || !origine || !fonenana || !categorie || !asa || !telephone) {
      alert("Fenoy daholo ny saha rehetra!");
      return;
    }

    if (!/^[0-9]{8,15}$/.test(telephone)) {
      alert("Laharana finday tsy mety!");
      return;
    }

    const data = {
      nom,
      origine,
      fonenana,
      categorie,
      asa,
      telephone,
      about,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("membres").add(data);

    alert("Vita soa aman-tsara!");

    clearForm();

    ajouterLigneUI(data);

    loadData(); // refresh dashboard instantly

  } catch (err) {
    console.error(err);
    alert("Misy olana: " + err.message);
  } finally {
    isSubmitting = false;
  }
}

////////////////////////////////////////////////////////////////////////////////
// 🧹 CLEAR FORM
////////////////////////////////////////////////////////////////////////////////
function clearForm() {

  ["nom","origine","fonenana","telephone","about"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.getElementById("categorie").selectedIndex = 0;
  document.getElementById("asa").selectedIndex = 0;
}

////////////////////////////////////////////////////////////////////////////////
// 📊 REAL TIME LOAD FROM FIREBASE
////////////////////////////////////////////////////////////////////////////////
function loadData() {

  db.collection("membres")
    .orderBy("createdAt", "desc")
    .onSnapshot((snap) => {

      allData = [];

      snap.forEach(doc => {
        allData.push({ id: doc.id, ...doc.data() });
      });

      renderTable(allData);

    });
}

////////////////////////////////////////////////////////////////////////////////
// 🧠 SEARCH + SORT ENGINE
////////////////////////////////////////////////////////////////////////////////
function getFilteredData() {

  let search = document.getElementById("searchBox")?.value?.toLowerCase() || "";

  let filtered = allData.filter(item => {
    return (
      item.nom?.toLowerCase().includes(search) ||
      item.telephone?.includes(search) ||
      item.origine?.toLowerCase().includes(search)
    );
  });

  // 🔵 SORT A → Z (nom)
  filtered.sort((a, b) => (a.nom || "").localeCompare(b.nom || ""));

  return filtered;
}

////////////////////////////////////////////////////////////////////////////////
// 🖥 RENDER TABLE
////////////////////////////////////////////////////////////////////////////////
function renderTable(data) {

  const tb = document.getElementById("tb");
  if (!tb) return;

  tb.innerHTML = "";

  let list = data || getFilteredData();

  list.forEach((d, i) => {

    tb.innerHTML += `
      <tr>

        <td>${i + 1}</td>
        <td>${d.nom || ""}</td>
        <td>${d.origine || ""}</td>
        <td>${d.fonenana || ""}</td>
        <td>${d.categorie || ""}</td>
        <td>${d.asa || ""}</td>
        <td>${d.telephone || ""}</td>
        <td>${d.createdAt?.toDate?.().toLocaleString() || ""}</td>

        <td>
          <button onclick="supprimer('${d.id}')">Supprimer</button>
        </td>

      </tr>
    `;
  });
}

////////////////////////////////////////////////////////////////////////////////
// 🔍 LIVE SEARCH (REAL TIME)
////////////////////////////////////////////////////////////////////////////////
function setupSearch() {

  const input = document.getElementById("searchBox");
  if (!input) return;

  input.addEventListener("input", () => {
    renderTable(getFilteredData());
  });
}

////////////////////////////////////////////////////////////////////////////////
// ➕ LIVE UI ADD (OPTIONAL)
////////////////////////////////////////////////////////////////////////////////
function ajouterLigneUI(d) {

  const tb = document.getElementById("tb");
  if (!tb) return;

  const row = tb.insertRow(0);

  row.innerHTML = `
    <td>--</td>
    <td>${d.nom}</td>
    <td>${d.origine}</td>
    <td>${d.fonenana}</td>
    <td>${d.categorie}</td>
    <td>${d.asa}</td>
    <td>${d.telephone}</td>
    <td>${new Date().toLocaleString()}</td>
    <td></td>
  `;
}

////////////////////////////////////////////////////////////////////////////////
// 🗑 DELETE
////////////////////////////////////////////////////////////////////////////////
function supprimer(id) {
  if (confirm("Hofafana ve?")) {
    db.collection("membres").doc(id).delete();
  }
}

////////////////////////////////////////////////////////////////////////////////
// 🚀 INIT
////////////////////////////////////////////////////////////////////////////////
loadData();
setupSearch();

////////////////////////////////////////////////////////////////////////////////
// 🌐 NAVIGATION
////////////////////////////////////////////////////////////////////////////////
function ouvrirDashboard() {
  window.location.href = "dashboard.html";
}