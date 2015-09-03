# angular-vertical-menu

[![Build Status](https://travis-ci.org/gnavarro77/angular-vertical-menu.svg?branch=master)](https://travis-ci.org/gnavarro77/angular-vertical-menu)[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Simple vertical menu.
## Demo
As demo is worth a thousand words, check it out [**demo**](http://gnavarro77.github.io/angular-vertical-menu/)

### Installation
Bower :
```sh
$ bower angular-vertical-menu --save
```

## Usage
``` html
<vertical-menu config="my-config"></vertical-menu>
```
### Json Config Object Schema
```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://jsonschema.net",
    "type": "object",
    "definitions": {
        "label": {
            "description": "Label of the menu item",
            "type": "string",
            "optional": false
        },
        "icon": {
            "description": "Name of a Font Awesome icon",
            "type": "string",
            "optional": false
        },
        "href": {
            "description": "Angular route path or url",
            "type": "string",
            "optional": false
        },
        "callback": {
            "description": "Callback function called when the item is activated. The callback function receive the underlying item object as the first argument.",
            "type": "string"
        }
    },
    "properties": {
        "default": {
            "type": "object",
            "properties": {
                "icon": {
                    "$ref": "#/definitions/icon"
                }
            }
        },
        "animation": {
            "description": "Customization of the animation. If not defined default parameters duration(0.4) and timing(ease) are used.",
            "type": "object",
            "properties": {
                "duration": {
                    "description": "Duration of the animation",
                    "type": "number",
                    "optional": false
                },
                "timing": {
                    "description": "The timing function to use for the animation",
                    "type": "string",
                    "optional": false
                }
            }
        },
        "data": {
            "description": "Declare the structure of menu",
            "type": "array",
            "items": {
                "description": "First level menu item",
                "type": "object",
                "properties": {
                    "label": {
                        "$ref": "#/definitions/label"
                    },
                    "icon": {
                        "$ref": "#/definitions/icon"
                    },
                    "badge": {
                        "description": "A value to be displayed as a badge",
                        "type": "string"
                    },
                    "oneOf": [
                        "href": {
                            "$ref": "#/definitions/href"
                        },
                        "callback": {
                            "$ref": "#/definitions/callback"
                        },
                        {
                            "required": [
                                "href"
                            ]
                        },
                        {
                            "required": [
                                "callback"
                            ]
                        }
                    ],
                    "children": {
                        "description": "List of sub items",
                        "type": "array",
                        "items": {
                            "description": "Second level item",
                            "type": "object",
                            "properties": {
                                "label": {
                                    "$ref": "#/definitions/label"
                                },
                                "icon": {
                                    "$ref": "#/definitions/icon"
                                },
                                "oneOf": [
                                    "href": {
                                        "$ref": "#/definitions/href"
                                    },
                                    "callback": {
                                        "$ref": "#/definitions/callback"
                                    },
                                    {
                                        "required": [
                                            "href"
                                        ]
                                    },
                                    {
                                        "required": [
                                            "callback"
                                        ]
                                    }
                                ]
                            },
                            "required": [
                                "label"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "label"
                ],
                "additionalProperties": false
            }
        }
    }
}
```

## Dependencies
* [AngularJS](https://github.com/angular/angular.js) - HTML enhanced for web apps!
* [Bootstrap](http://getbootstrap.com/) - sleek, intuitive, and powerful front-end framework
* [Font Awesome](https://fortawesome.github.io/Font-Awesome/) - the iconic font and CSS toolkit

## Development
Clone the project
```sh
git clone https://github.com/gnavarro77/angular-vertical-menu.git
```
### Build
```sh
gulp build-js
gulp build-css
```
### Run tests
```sh
gulp test
```
### Run demo
```sh
gulp serve-demo
```
### Build demo
```sh
gulp build-demo
```

### License
MIT


