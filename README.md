# Typescript Convict  

[![Build Status](https://travis-ci.com/Akirix/convict-model.svg?branch=master)](https://travis-ci.com/Akirix/convict-model)
[![NPM version](http://img.shields.io/npm/v/convict-model.svg)](https://www.npmjs.com/package/convict-model) 
 
[![GitHub forks](https://img.shields.io/github/forks/akirix/convict-model.svg?style=social&label=Fork)](https://github.com/akirix/convict-model/fork)
[![GitHub stars](https://img.shields.io/github/stars/akirix/convict-model.svg?style=social&label=Star)](https://github.com/akirix/convict-model)

Annotate a class to define and validate your configs using [convict](https://www.npmjs.com/package/convict) 
just like you do with an ORM. If you like annotating 
models classes, then this package will tickle your fancy. The 
code style and patterns are based on [Typeorm](https://typeorm.io/#/) because they 
know what's up. If your using a IOC/DI system, ConvictModel will fit in real nice. 


## Requirements  

 - [NodeJS 8+](https://nodejs.org/en/)
 - [Typescript 3+](https://www.npmjs.com/package/typescript)
 - [Convict 5+](https://www.npmjs.com/package/convict)

### Quick Links
[Contributing](/CONTRIBUTING.md) | [Changelog](/CHANGELOG.md) | [Convict](https://www.npmjs.com/package/convict) | 
|---|---|---|

## Installation  

1. Install the package

`npm install @akirix/convict-model --save`  

2. Install `reflect-metadata` if you have not already so the annotations work. 

`npm install reflect-metadata --save`

then import it in global scope aka main file, i.e. `app.ts` or `index.ts`

`import "reflect-metadata";`

3. Now we install convict and its types so you can control the version

`npm install convict --save`  
`npm install @types/convict --save-dev`  

4. Make sure annotations are enabled in `tsconfig.json`

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

5. (optional) Install JS Yaml if you like yaml over json for configs. 

`npm install js-yaml --save`

## Project Setup  

First we need a proper project setup like the one below with a folder to hold our config 
schema classes. This is a very simple Typescript folder structure. 

```
MyProject
├── src                  // place of your TypeScript code
│   ├── schema           // place where your config entities will go
│   │   ├── MyConfig.ts  // sample entity
│   │   └── SubConfig.ts // a nested entity
│   ├── types.d.ts       // place to put your interfaces  
│   └── index.ts         // start point of your application
├── .gitignore           // standard gitignore file
├── config.json          // Your apps config file
├── package.json         // node module dependencies
├── README.md            // a readme file
└── tsconfig.json        // TypeScript compiler options
```

Take note of the `src/schema` directory, here we will put our config schema classes 
which will be annotated with convict schema definitions. This directory can be called whatever 
you like by the way. Technically you don't even need the folder, it's just a good idea 
to put similar classes together for organization. 

## Getting Started  

Now we can start building up a model for our config schema. 

### 1. Define an Interface  

It's a good idea to define an interface so your experience can be agile and include 
all the fancy IDE features. Interfaces also open an opportunity to have more than one 
implementation of your config, i.e. maybe you use convict competitor or no validation 
on config at all. 

`src/types.d.ts`
```typescript
declare namespace config {
    export interface MyConfig {
        name: string;
        subConfig: SubConfig;
    }
    export interface SubConfig {
        bar: number;
    }
}
```

### 2. Define a Schema Class  

Now we can define a schema class and decorate it like Christmas. The parameter for 
`@Property` decorator is simply a convict `SchemaObj` like in normal convict. You can 
read all about the possible options in [convicts documentation](https://www.npmjs.com/package/convict).

`src/schema/MyConfig.ts`
```typescript
import { Property } from '@akirix/convict-model';
import SubConfig from './SubConfig';
import * as yaml from 'js-yaml';

@Config({
    as: 'foo',// an alias for the config file, i.e base name
    dir: 'config',// relative to NODE_PATH or cwd()
    parser: { 
        extension: ['yml', 'yaml'], 
        parse: yaml.safeLoad
    }
})
export default class MyConfig implements config.MyConfig {
    
    @Property({
        doc: 'The name of the thing',
        default: 'Convict',
        env: 'MY_CONFIG_NAME'
    })
    public name: string;

    @Property(SubConfig)
    public subConfig: SubConfig;

}
```

`src/schema/SubConfig.ts`
```typescript
export default class SubConfig {
    @Property({
        doc: 'A sub prop',
        default: 3,
        env: 'SUB_CONFIG_BAR',
        format: 'int'
    })
    public bar: number;
}
```

### 3. Make a Configuration  

Now we can make our configuration for our app. This can be a hardcoded Object in 
your code, a json file, a yaml file, or however you do it. In the end it's up to you 
how you type out and load the data. 

`config.json`
```json
{
    "name": "Cool App",
    "subConfig": {
        "bar": 5
    }
}
```

### 4. Load it up

We have a couple of ways to load it up so you can choose what works for your unique 
situation. The example below is the simplest way in the spirit of TL;DR.

`src/index.ts`
```typescript
import { getConvictModel, ConvictModel } from '@akirix/convict-model';

//get your config file however you do it
const myRawConfig = getMyConfigData();

//initialize the ConvictModel with a list of paths or entities to load as the schema
const convictModel: ConvictModel = getConvictModel(['src/schema/**/*.*s']);

//get your validated config object as a serialized class
const myConfig: config.MyConfig = convictModel.create<config.MyConfig>('MyConfig',myRawConfig);

```
