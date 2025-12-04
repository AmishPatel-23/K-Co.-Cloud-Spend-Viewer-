let rawData = [];
let filteredData = [];
let sortAsc = true;

async function loadData() {
  const res = await fetch("data.json");
  rawData = await res.json();

  document.getElementById("loading").classList.add("d-none");
  document.getElementById("dataTable").classList.remove("d-none");

  applyFilters();
}

function applyFilters() {
  const cloud = document.getElementById("filterCloud").value;
  const team = document.getElementById("filterTeam").value;
  const env = document.getElementById("filterEnv").value;

  filteredData = rawData.filter(item => {
    return (
      (cloud === "all" || item.cloud_provider === cloud) &&
      (team === "all" || item.team === team) &&
      (env === "all" || item.env === env)
    );
  });

  updateTable();
  updateSummary();
}

function updateTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  if (filteredData.length === 0) {
    document.getElementById("emptyState").classList.remove("d-none");
    document.getElementById("dataTable").classList.add("d-none");
    return;
  }

  document.getElementById("emptyState").classList.add("d-none");
  document.getElementById("dataTable").classList.remove("d-none");

  filteredData.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.date}</td>
        <td>${item.cloud_provider}</td>
        <td>${item.service}</td>
        <td>${item.team}</td>
        <td>${item.env}</td>
        <td>$${item.cost_usd.toFixed(2)}</td>
      </tr>
    `;
  });
}

function updateSummary() {
  let total = 0, aws = 0, gcp = 0;

  filteredData.forEach(item => {
    total += item.cost_usd;
    if (item.cloud_provider === "AWS") aws += item.cost_usd;
    if (item.cloud_provider === "GCP") gcp += item.cost_usd;
  });

  document.getElementById("totalSpend").textContent = `$${total.toFixed(2)}`;
  document.getElementById("awsSpend").textContent = `$${aws.toFixed(2)}`;
  document.getElementById("gcpSpend").textContent = `$${gcp.toFixed(2)}`;
}

document.getElementById("filterCloud").addEventListener("change", applyFilters);
document.getElementById("filterTeam").addEventListener("change", applyFilters);
document.getElementById("filterEnv").addEventListener("change", applyFilters);

document.getElementById("sortCost").addEventListener("click", () => {
  sortAsc = !sortAsc;
  filteredData.sort((a,b) =>
    sortAsc ? a.cost_usd - b.cost_usd : b.cost_usd - a.cost_usd
  );
  updateTable();
});

loadData();
