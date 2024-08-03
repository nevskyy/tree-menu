// const folders = document.getElementsByClassName('folder');

// for (const folder of folders ) {
//   folder.addEventListener('click', () => onTapOnFolder(folder));
// }

// function onTapOnFolder(folder) {
//   let folderFilesList = folder.nextElementSibling;

//   if (folderFilesList.classList.contains('collapsed')) {
//     folderFilesList.classList.remove('collapsed')
//   } else {
//     folderFilesList.classList.add('collapsed')
//   }
// }
// console.log(folders);

// Data: array of files

// const data = [
//   { id: 1, name: "File1", type: "file", parent: 0 },
//   { id: 2, name: "Folder1", type: "folder", parent: 0 },
//   { id: 3, name: "File2", type: "file", parent: 2 },
// ];

// const data = [
//   { id: 1, name: "Root", type: "folder", parent: 0 },
//   { id: 2, name: "TestFile", type: "file", parent: 0 },
// ];
// const data = JSON.parse(localStorage.getItem("treeData"));

// localStorage.clear();
// const nlist = new NList(document.getElementById("nlist"), data);
const nlist = new NList(document.getElementById("nlist"));
// console.log(document.getElementById("nlist"));


