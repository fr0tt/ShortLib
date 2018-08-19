<p style="text-align: center">
    <a href="https://www.shortlib.com"target="_blank">
        <img width="100" src="https://www.shortlib.com/static/logo/logo.svg" alt="Shortlib Logo">
    </a>
</p>

<h1 style="text-align: center">ShortLib</h1>

ShortLib is an open source project accommodating keyboard shortcuts for Windows, Mac and Linux. 

[Website](https://www.shortlib.com) |
[Third Party Notices](ThirdPartyNotices.txt) 

## Table of Contents

* [Contribute](#contribute)
* [To-Do](#to-do)

## Contribute

### Contribute shortcuts for a new program
- create a new folder in content (content/YOUR-FOLDER-NAME)
- add an icon to your new folder (content/YOUR-FOLDER-NAME/icon.svg)
- create an index.yaml file to your new folder (content/YOUR-FOLDER-NAME/index.yaml)
- fill index.yaml accordingly (see below or have a look at existing programs)

| Key            | Description                                     | Example value                          | 
| -------------- |:-----------------------------------------------:| --------------------------------------:|
| name           | name of the application                         | Super Cool Program                     |
| image_src      | relative path to the applications icon          | icon.svg                               |
| description    | a short summary about the application           | Once upon a time ...                   |
| developer      | name of the developer                           | Super Cool Developer LLC               | 
| website        | link to the developer                           | https://github.com/fr0tt               |
| source         | links to used references                        | https://github.com/fr0tt               |
| OS             | operating systems of defined shortcuts (so if every linux shortcut is the exact same as on windows, just define only windows and set generate_linux as true)                | win or linux or mac                    |
| generate_linux | show linux users windows shortcut if no linux shortcut was defined                                                                                                               | true or false                          |
| time           | creation time in ISO-8061 format (https://www.w3.org/QA/Tips/iso-date)
                                                                   | 1970-12-24 or 1970-12-24T00:00:00.000Z |

## To-Do

- [ ] mobile "meant for"-design
- [x] Table of Content
- [x] anchor for sections
- [ ] production and dev enviroment variable (e.g. for vue.min)
- [ ] watch mode: show some sign of everything-is-ok after an error but only once
- [ ] support json as content type
- [ ] app.njk: only show host instead of full URL as a costum filter with https://nodejs.org/api/url.html#url_url_host

---

- [ ] (some sort of) gui to create new content
- [ ] highlight frequently needed shortcuts
- [ ] support filter function by using synonyms (words/moby, FinNLP/synonyms, Datamuse API, WordsAPI, WordNET, thesaurus.altervista.org, abbreviations.com, dictionary.com, bighugelabs.com, watson.kmi.open.ac.uk, ..)
- [ ] list contributors with nodejs (https://github.com/github-tools/github)
- [ ] create pdfs if possible in browser (https://github.com/foliojs/pdfkit, https://github.com/marcbachmann/node-html-pdf (only nodejs), https://github.com/bpampuch/pdfmake)
- [ ] rebuild only parts instead of just rebuilding everything everytime
- [ ] support tags