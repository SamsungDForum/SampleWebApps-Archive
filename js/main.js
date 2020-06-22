App = window.App || {};
App.Main = (function Main() {
    var logger = App.Logger.create({
        loggerEl: document.querySelector('.logsContainer'),
        loggerName: 'Main',
        logLevel: App.Logger.logLevels.ALL
    });

    var fileListEl = document.querySelector('#file-list');
    var archiveListEl = document.querySelector('#archive-list');

    var WRITABLE_DIRECTORY = 'wgt-private';
    var READABLE_DIRECTORY = 'wgt-package';
    var WRITABLE_SUBDIRECTORY = 'archiveApp';
    var READABLE_SUBDIRECTORY = 'assets/demo_files';

    var SAMPLE_ARCHIVE = 'sample_archive.zip';

    var basicMenu = App.Navigation.getMenu('Basic');

    function registerFilesMenu() {
        App.Navigation.registerMenu({
            name: 'FilesMenu',
            domEl: document.querySelector('.column.right-border'),
            alignment: 'vertical',
            nextMenu: 'Basic',
            onAfterLastItem: function () {
                App.Navigation.changeActiveMenu('Basic');
            }
        });
        basicMenu.previousMenu = 'FilesMenu';
    }

    function copyFile(file, dir) {
        dir.copyTo(
            file.fullPath,
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY + '/' + file.name,
            false,
            function onCopySuccess() {
                logger.log('successfuly copied file: ' + file.name);
            }
        );
    }

    // handles copying files from wgt-package/assets/demo_files read only directory to wgt-private/archiveApp directory
    function copyFilesToDirectory() {
        tizen.filesystem.resolve(
            READABLE_DIRECTORY + '/' + READABLE_SUBDIRECTORY,

            function onResolveSuccess(dir) {
                dir.listFiles(
                    function onListSuccess(files) {
                        files.forEach(
                            function (file) {
                                copyFile(file, dir);
                            }
                        );
                        listFilesFromDirectory();
                    },

                    function onListFail(e) {
                        logger.error(e.message + ' - listing demo_files directory');
                    }
                );
            },

            function onResolveFail(e) {
                logger.error(e.message + ' - opening package directory');
            },

            'r'
        );
    }

    function createFileDirectory() {
        tizen.filesystem.resolve(
            WRITABLE_DIRECTORY,

            function onCreateSuccess(dir) {
                dir.createDirectory(WRITABLE_SUBDIRECTORY);
                copyFilesToDirectory();
            },

            function onCreateFail(e) {
                logger.error(e.message + ' - reading wgt-private directory');
            },
            'rw'
        );
        logger.log('Directory initialized');
    }

    // checks if wgt-private/archiveApp directory exists, and if not creates it
    function initFileDirectory() {
        tizen.filesystem.resolve(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY,

            function onResolveSuccess() { // Directory exists
                listFilesFromDirectory();
                logger.log('Directory initialized earlier');
            },
            createFileDirectory,
            'r'
        );
    }

    function listFiles(dir) {
        dir.listFiles(
            function onListSuccess(files) {
                fileListEl.innerHTML = '<header>Files</header>';
                files.forEach(
                    function createEl(file) {
                        if (file.name !== SAMPLE_ARCHIVE) {
                            addButton(file.name, fileListEl);
                        }
                    }
                );
            },

            function onListFail(e) {
                logger.error(e.message + ' - listing wgt-private/archiveApp directory');
            }
        );
    }

    // Goes through archiveApp directory and lists files in it
    function listFilesFromDirectory() {
        tizen.filesystem.resolve(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY,
            listFiles,
            function onResolveFail(e) {
                logger.error(e.message + ' - reading wgt-private/archiveApp directory');
            },

            'r'
        );
    }

    function addButton(fileName, targetEl) {
        var buttonEl = document.createElement('button');

        buttonEl.innerText = fileName;

        buttonEl.setAttribute('class', 'file-button');
        buttonEl.setAttribute('data-list-item', '');
        buttonEl.setAttribute('id', fileName);

        targetEl.appendChild(buttonEl);
    }


    function filesButtonHandler() {
        document.querySelector('.active').classList.toggle('chosen');
    }

    function listArchiveElement(archive, name) {
        archive.getEntryByName(
            name,
            function onRetrieveSuccess(entry) {
                addButton(entry.name, archiveListEl);
            },

            function onRetrieveFail(e) {
                logger.error(e.message + ' - listing-archive');
            }
        );
    }

    function listAllArchiveElements() {
        tizen.archive.open(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY + '/' + SAMPLE_ARCHIVE,
            'rw',
            function onOpenSuccess(archive) {
                archive.getEntries(
                    function onRetrieveSuccess(entries) {
                        archiveListEl.innerHTML = '<header>Archive</header>';
                        entries.forEach(function (entry) {
                            addButton(entry.name, archiveListEl);
                        });
                    },

                    function onRetrieveFail() {
                        logger.log('Unable to recieve entries in archive');
                    }
                );
            },

            function onOpenFail() {
                logger.log('Unable to open archive or archive not found');
            }
        );
    }

    function deleteItem(name) {
        tizen.filesystem.resolve(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY,

            function onResolveSuccess(dir) {
                dir.deleteFile(
                    WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY + '/' + name,

                    function onDeleteSuccess() {
                        logger.log('Deleted file: ' + name);
                        listFilesFromDirectory();
                        listAllArchiveElements();
                    },

                    function onDeleteFail() {
                        logger.error('Something went wrong while deleting a file: ' + name);
                    }
                );
            },

            function onResolveFail(e) {
                logger.error(e.message);
            },
            'w'
        );
    }

    function addFiles(archive, compressionLevel) {
        var chosenNodeListEl = document.querySelectorAll('.chosen');
        var chosenList = Array.prototype.slice.call(chosenNodeListEl);

        chosenList.forEach(function (el) {
            el.classList.toggle('chosen');
            archive.add(
                WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY + '/' + el.id,

                function onAddSuccess() {
                    logger.log('Added file: ' + el.id + ' to the archive');
                    listArchiveElement(archive, el.id);
                    deleteItem(el.id);
                },

                function onAddFail(e) {
                    logger.error(e.message + ' - adding file to the archive');
                },

                function onAddProgress(operationId, value, name) {
                    logger.log('[' + operationId + '] File ' + name + ' is loading into an archive: ' + value);
                },

                {
                    stripSourceDirectory: true,
                    compressionLevel: compressionLevel
                }
            );
        });
    }

    function addFilesHandler(compressionLevel) {
        tizen.archive.open(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY + '/' + SAMPLE_ARCHIVE,
            'rw',

            function onOpenSuccess(archive) {
                addFiles(archive, compressionLevel);
            },

            function onOpenFail(e) {
                logger.error(e.message + ' - opening archive');
            },

            { overwrite: false }
        );
    }

    function extraction(archive) {
        archive.extractAll(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY,

            function onExtractSuccess() {
                listFilesFromDirectory();
                deleteItem(SAMPLE_ARCHIVE);
            },

            function onExtractFail() {
                logger.error('Failed to extract');
            },

            function onExtractProgress(operationId, value, name) {
                logger.log(
                    '[' + operationId + '] File ' + name + ' is beeing extracted from an archive: ' + value
                );
            }
        );
    }

    function extractHandler() {
        tizen.archive.open(
            WRITABLE_DIRECTORY + '/' + WRITABLE_SUBDIRECTORY + '/' + SAMPLE_ARCHIVE,
            'r',
            extraction,

            function onOpenFail() {
                logger.error('Could not retrieve entries from archive');
            }
        );
    }

    function addButtonsHandlers() {
        var buttonsWithHandlers = [
            {
                elementSelector: '.add',
                handler: function () {
                    addFilesHandler('NORMAL');
                }
            },
            {
                elementSelector: '.fast-add',
                handler: function () {
                    addFilesHandler('FAST');
                }
            },
            { elementSelector: '.extract', handler: extractHandler }
        ];

        App.KeyHandler.addHandlersForButtons(buttonsWithHandlers);
        App.KeyHandler.addHandlerForDelegated('.column.right-border', filesButtonHandler);
    }

    window.onload = function () {
        initFileDirectory();
        listAllArchiveElements();
        addButtonsHandlers();
        registerFilesMenu();
    };
}());
