const isNonEmptyArray = (array) => {
  return Array.isArray(array) && array.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(columnsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    throw new Error(
      "Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado",
    );
  }
  const tableElement = document.getElementById(tableId);
  if (!tableElement || tableElement.tagName !== "TABLE") {
    throw new Error("Id informado não corresponde a uma tabela");
  }

  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
  function createTheadElement(tableReference) {
    const thead = document.createElement("thead");
    tableReference.appendChild(thead);
    return thead;
  }

  const tableHeaderReference =
    tableReference.querySelector("thead") ?? createTheadElement(tableReference);
  tableHeaderReference.innerHTML = "";

  const headerRow = document.createElement("tr");
  ["bg-blue-900", "text-white", "sticky", "top-0"].forEach((cssClass) =>
    headerRow.classList.add(cssClass),
  );
  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class="text-center">${tableColumnObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement;
  }
  tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
  function createTbodyElement(tableReference) {
    const tbody = document.createElement("tbody");
    tableReference.appendChild(tbody);
    return tbody;
  }

  const tableBodyReference =
    tableReference.querySelector("tbody") ?? createTbodyElement(tableReference);
  tableBodyReference.innerHTML = "";

  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement("tr");
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add("bg-blue-100");
    }
    for (const tableColumn of columnsArray) {
      const formatFunction = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class="text-center">${formatFunction(tableItem[tableColumn.acessor])}</td>`;
    }
    tableBodyReference.appendChild(tableRow);
  }
}
