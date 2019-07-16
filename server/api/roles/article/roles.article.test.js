'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const config = require('../user')
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const connection = require('../../app');
