class NList {
  static FILE_ID_PREPEND = "nlistfile-";
  static NEW_FILE_IDX = 100;
  constructor(listElem, data) {
    this.listElem = listElem; // <div id='nlist' class="nlist-container"></div>
    this.data = null;
    this.menu = listElem.children[0];
    this.selectedFile = null;
    this.build();
    this.bindEvents();
  }

  // const data = [
  //   { id: 1, name: "Root", type: "folder", parent: 0 },
  //   { id: 2, name: "TestFile", type: "file", parent: 0 },
  // ];

  build() {
    //Clear list
    // this.listElem.innerHTML = '';
    // loop through data and fill list files
    this.getLocalStorage();

    for (let i = 0; i < this.data.length; i++) {
      let file = this.data[i];

      if (file.type === "file") {
        // File
        let fileElem = this.makeFileElem(file.name);
        fileElem.id = NList.FILE_ID_PREPEND + file.id;

        let parentElem =
          file.parent === 0
            ? this.listElem
            : document.getElementById(NList.FILE_ID_PREPEND + file.parent)
                .nextElementSibling;

        if (parentElem) {
          parentElem.appendChild(fileElem);
        }
      } else {
        //Folder
        let fileElem = this.makeFolderElem(file.name);
        fileElem.id = NList.FILE_ID_PREPEND + file.id;

        let filesListElem = this.makeFilesListElem();

        let parentElem =
          file.parent === 0
            ? this.listElem
            : document.getElementById(NList.FILE_ID_PREPEND + file.parent)
                .nextElementSibling;

        if (parentElem) {
          parentElem.appendChild(fileElem);
          parentElem.appendChild(filesListElem);
        }
      }
    }
  }

  bindEvents() {
    //click events
    this.listElem.addEventListener("click", (e) => {
      let target = e.target;

      if (this.menu.style.display === "block") this.menu.style.display = "none";
      //toggle folder files list
      if (
        target.classList.contains("bi-caret-right") ||
        target.classList.contains("bi-caret-down")
      ) {
        this.onToggleFolderContents(target.parentElement);
      } else if (
        target.classList.contains("file") ||
        target.classList.contains("folder") ||
        target.classList.contains("file-name") ||
        target.classList.contains("file-icon")
      ) {
        this.onTapOnFile(target);
      } else if (target.classList.contains("nlist-container")) {
        this.deselectSelectedFile();
      }
    });

    this.menu.addEventListener("click", (e) => {
      let buttonRole = e.target.dataset.role;

      if (buttonRole) {
        if (buttonRole === "newfile") {
          this.onAddFile("file");
        } else if (buttonRole === "newfolder") {
          this.onAddFile("folder");
        } else if (buttonRole === "rename") {
          this.onRenameFile();
        } else if (buttonRole === "delete") {
          this.onDeleteFile();
        }
      }
    });

    //contextmenu event
    this.listElem.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      let target = e.target;

      if (target.classList.contains("nlist-container")) {
        this.deselectSelectedFile();
      }
      //if target is file or folder select it
      if (
        target.classList.contains("file") ||
        target.classList.contains("folder") ||
        target.classList.contains("fileName") ||
        target.classList.contains("fileIcon")
      ) {
        //select file
        this.onTapOnFile(target);
      }
      //open menu
      this.onOpenMenu(
        e,
        target.classList.contains("file") &&
          !target.classList.contains("folder"),
        target.classList.contains("folder"),
        target.classList.contains("nlist-container")
      );
    });
  }

  // <div class="nlist-container">
  // <span class="file">
  //   <i class="bi bi-file-earmark file-icon"></i>
  //   <span class="file-name">File1</span>
  // </span>
  makeFileElem(name) {
    let file = document.createElement("span");
    file.className = "file";

    let fileIcon = document.createElement("i");
    fileIcon.className = "bi bi-file-earmark file-icon";

    let fileName = document.createElement("span");
    fileName.className = "file-name";
    fileName.innerText = name;

    file.appendChild(fileIcon);
    file.appendChild(fileName);

    return file;
  }

  // <span class="file folder">
  //   <i class="bi bi-folder file-icon"></i>
  //   <span class="file-name">Folder1</span>
  //   <i class="bi bi-caret-down file-icon"></i>
  // </span>
  makeFolderElem(name) {
    let file = document.createElement("span");
    file.className = "file folder";

    let fileIcon = document.createElement("i");
    fileIcon.className = "bi bi-folder file-icon";

    let fileName = document.createElement("span");
    fileName.className = "file-name";
    fileName.innerText = name;

    let caretIcon = document.createElement("i");
    caretIcon.className = "bi bi-caret-right file-icon";

    file.appendChild(fileIcon);
    file.appendChild(fileName);
    file.appendChild(caretIcon);

    return file;
  }

  // <div class="file-list collapsed">
  makeFilesListElem() {
    let filesList = document.createElement("div");
    filesList.className = "files-list";

    return filesList;
  }

  // ACTIONS
  addFile(file) {
    this.data.push(file);
    this.setLocalStorage();

    if (file.type === "file") {
      let fileElem = this.makeFileElem(file.name);
      fileElem.id = NList.FILE_ID_PREPEND + file.id;

      let parentElem =
        file.parent === 0
          ? this.listElem
          : document.getElementById(NList.FILE_ID_PREPEND + file.parent)
              .nextElementSibling;

      if (parentElem) {
        parentElem.appendChild(fileElem);
      }
    } else {
      let fileElem = this.makeFolderElem(file.name);
      fileElem.id = NList.FILE_ID_PREPEND + file.id;

      let filesListElem = this.makeFilesListElem();
      let parentElem =
        file.parent === 0
          ? this.listElem
          : document.getElementById(NList.FILE_ID_PREPEND + file.parent)
              .nextElementSibling;

      if (parentElem) {
        parentElem.appendChild(fileElem);
        parentElem.appendChild(filesListElem);
      }
    }
  }

  renameFile(file, newName) {
    let fileElem = document.getElementById(NList.FILE_ID_PREPEND + file.id);

    if (fileElem) {
      file.name = newName;
      fileElem.children[1].innerText = newName;

      this.setLocalStorage();
    }
  }

  deleteFile(file) {
    let fileElem = document.getElementById(NList.FILE_ID_PREPEND + file.id);

    if (fileElem) {
      if (this.selectedFile === file) this.selectedFile = null;
      this.data = this.data.filter(
        (f) => f.id !== file.id || f.parent === file.id
      );
      if (file.type === "folder")
        fileElem.nextElementSibling.parentElement.removeChild(
          fileElem.nextElementSibling
        );
      fileElem.parentElement.removeChild(fileElem);
    }

    this.setLocalStorage();
  }

  // EVENTS
  onOpenMenu(e, targetIsFile, targetIsFolder, targetIsListContainer) {
    this.menu.children[0].style.display =
      !targetIsFile || targetIsFolder ? "block" : "none";
    this.menu.children[1].style.display =
      !targetIsFile || targetIsFolder ? "block" : "none";
    this.menu.children[2].style.display = !targetIsListContainer
      ? "block"
      : "none";
    this.menu.children[3].style.display = !targetIsListContainer
      ? "block"
      : "none";
    let nlistRect = this.listElem.getBoundingClientRect();
    let xpos = 11;
    let ypos = e.clientY - nlistRect.y;
    this.menu.style.left = xpos + "px";
    this.menu.style.top = ypos + "px";
    this.menu.style.display = "block";
  }

  onToggleFolderContents(folderElem) {
    // toggle collapse
    let folderFilesListElem = folderElem.nextElementSibling;

    if (folderFilesListElem.classList.contains("collapsed")) {
      //remove collapsed class if is collapsed
      folderFilesListElem.classList.remove("collapsed");
      folderElem.children[2].style.transform = "rotate(0deg)";
    } else {
      //add collapsed class if not collapsed
      folderFilesListElem.classList.add("collapsed");
      folderElem.children[2].style.transform = "rotate(90deg)";
    }
  }

  onTapOnFile(fileElem) {
    let fileElemIdStr = fileElem.classList.contains("file")
      ? fileElem.id
      : fileElem.parentElement.id;
    let fileId = parseInt(fileElemIdStr.split("-")[1]);
    let file = this.data.find((f) => f.id === fileId);

    if (file) {
      if (this.selectedFile)
        document
          .getElementById(NList.FILE_ID_PREPEND + this.selectedFile.id)
          .classList.remove("selected");
      document
        .getElementById(NList.FILE_ID_PREPEND + file.id)
        .classList.add("selected");
      this.selectedFile = file;
    }
  }

  onAddFile(fileType = "file") {
    const fileTypeCap = fileType === "file" ? "File" : "Folder";

    if (this.selectedFile) {
      let fileName = prompt(fileTypeCap + " Name >");
      this.addFile({
        id: NList.NEW_FILE_IDX++,
        name: fileName,
        type: fileType,
        parent: this.selectedFile.id,
      });
    } else {
      let fileName = prompt(fileTypeCap + " Name >");
      this.addFile({
        id: NList.NEW_FILE_IDX++,
        name: fileName,
        type: fileType,
        parent: 0,
      });
    }
  }

  onRenameFile() {
    if (this.selectedFile) {
      let newFileName = prompt("New Name >");
      this.renameFile(this.selectedFile, newFileName);
    }
  }

  onDeleteFile() {
    if (this.selectedFile) {
      if (confirm("Delete selected file?")) {
        this.deleteFile(this.selectedFile);
      }
    }
  }

  // HELPERS
  deselectSelectedFile() {
    if (this.selectedFile) {
      document
        .getElementById(NList.FILE_ID_PREPEND + this.selectedFile.id)
        .classList.remove("selected");
      this.selectedFile = null;
    }
  }

  setLocalStorage() {
    localStorage.setItem("treeData", JSON.stringify(this.data));
  }

  getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("treeData"));

    if (!data) {
      this.data = [
        { id: 1, name: "Root", type: "folder", parent: 0 },
        { id: 2, name: "TestFile", type: "file", parent: 0 },
      ];
    } else {
      this.data = data;
    }
  }
}
