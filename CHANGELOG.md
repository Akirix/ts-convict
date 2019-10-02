# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added

## [0.2.0] - 2019-11-02
### Added
 - renamed to just convict-model, dropped the @akirix
 - a lot of useful tests and even debug scripts
 - types are guessed when format left empty on a property annotation
 - simple top level gettter for convictModel called `getConvictModel`
 - refactored a bunch to open up more features from convict
 - defined the Config annotation
 - two ways to create now, both have the same useage too
   - simpleCreate: recursive create flat configs and merge to one
   - create: get the whole convict schema and whole config and load all at once

## [0.1.0] - 2019-10-10
### Added
 - A super well done changelog. Hope you agree. 
 - Other convict model classes as a property
 - some good tests

## [0.0.5] - 2019-05-16
### Added
 - load convict model classes using classes or paths to files to load
 - write simple model classes. Simple as in basic data types for the attributes
 - ci scripts for dev-ops automation using Travis with Github
 - unit testing scripts
