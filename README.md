# Archive

This application demonstrates the usage of `tizen.archive` API.
With this API it is possible to create and manage archive files and also extract files from archives.


## How to use the application

Use TV remote controller to navigate. By clicking on example files user marks them and then 
using **Add selected** or **Fast add selected** button adds them into example archive.

* **Add selected** uses `'NORMAL'` setting `ArchiveCompressionLevel` (default value)

* **Fast add selected** uses `'FAST'` setting `ArchiveCompressionLevel` (fastest compression method, lower compression savings)

Using **Extract all** button user can retrieve data from an archive.


## Supported platforms

2015 and newer


### Privileges

In order to use `tizen.archive` API the following privileges and metadata must be included in `config.xml`:

```xml
<tizen:privilege name="http://tizen.org/privilege/filesystem.write" />
<tizen:privilege name="http://tizen.org/privilege/filesystem.read" />
```

### File structure

```
Archive/ - Archive sample app root folder
│
├── assets/ - resources used by this app
│   │
│   ├── demo_files - contains files used to demonstrate archiving
│   │   │
│   │   ├── Image_Large.png - contains files used to demonstrate archiving
│   │   ├── Image.png - contains files used to demonstrate archiving
│   │   ├── Text_Empty.txt - contains files used to demonstrate archiving
│   │   ├── Text_Long.txt - contains files used to demonstrate archiving
│   │   └── Text_Short.txt - contains files used to demonstrate archiving
│   │
│   └── JosefinSans-Light.ttf - font used in application
│
├── css/ - styles used in the application
│   │
│   ├── main.css - styles specific for the application
│   └── style.css - style for application's template
│
├── js/ - scripts used in the application
│   │
│   ├── init.js - script that runs before any other for setup purpose
│   ├── keyhandler.js - module responsible for handling keydown events
│   ├── logger.js - module allowing user to register logger instances
│   ├── main.js - main application script
│   ├── navigation.js - module responsible for handling in-app focus and navigation
│   └── utils.js - module with useful tools used through application
│
├── CHANGELOG.md - changes for each version of application
├── config.xml - application's configuration file
├── icon.png - application's icon
├── index.html - main document
└── README.md - this file
```

## Other resources

*  **Archive API**  
  https://developer.samsung.com/tv/develop/api-references/tizen-web-device-api-references/archive-api

*  **Archive Guide**  
  https://developer.tizen.org/development/guides/web-application/data-storage-and-management/file-archiving

* **Filesystem API**  
  https://developer.samsung.com/tv/develop/api-references/tizen-web-device-api-references/filesystem-api


## Copyright and License

**Copyright 2019 Samsung Electronics, Inc.**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
