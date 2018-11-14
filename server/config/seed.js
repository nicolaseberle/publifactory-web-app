/**
 * Populate DB with admin user data on server start
 */

'use strict'

var User = require('../api/user/user.model')
var Article = require('../api/article/article.model');

const gen_text = '<p>Hoc inmaturo interitu ipse quoque sui pertaesus excessit e vita aetatis nono anno atque vicensimo cum quadriennio imperasset. natus apud Tuscos in Massa Veternensi, patre Constantio Constantini fratre imperatoris, matreque Galla sorore Rufini et Cerealis, quos trabeae consulares nobilitarunt et praefecturae.</p>';

// search for admin user, if no, create one
User.find({}, function (err, users) {
  if (err) throw err
  if(!users){users = createUsers()}

  createArticles(users)

})



function createArticles(user_tmp) {
    Article.find({}).remove()
        .then(() => {

          let article = Article.create(
          {
            title: 'Intestinal barrier dysfunction links metabolic and inflammatory markers of aging to death in Drosophila',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            authors: [user_tmp[5]._id,user_tmp[2]._id],
            reviewers : [user_tmp[4]._id,user_tmp[5]._id],
            published: true,
            content: gen_text,
            arr_content: [{
                            title:"Introduction",
                            content: gen_text,
                          },
                          {
                            title:"Results",
                            content: gen_text,
                          },
                          {
                            title:"Conclusion",
                            content: gen_text,
                          }],
            status: 'Reviewing',
            doi: '10.1073/pnas.1215849110',

          }, {
            title: 'New Article 2',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            authors: [user_tmp[6]._id,user_tmp[8]._id],
            reviewers : [user_tmp[2]._id,user_tmp[4]._id],
            published: true,
            content: gen_text,
            arr_content: [{
                            title:"Introduction",
                            content: gen_text,
                          },
                          {
                            title:"Results",
                            content: gen_text,
                          },
                          {
                            title:"Conclusion",
                            content: gen_text,
                          }],
            status: 'Reviewing',
            doi: '10.1073/pnas.1215849110',

          }, {
            title: 'New Article 3',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            authors: [user_tmp[5]._id,user_tmp[3]._id],
            published: true,
            content: gen_text,
            status: 'Draft',
            doi: '',

          });
          return article;
        })
        .then(() => console.log('finished populating articles'))
        .catch(err => console.log('error populating articles', err));

}

function createUsers() {
  User.find({}).remove()
    .then(() => {
      let users = User.create({
        provider: 'local',
        role: 'admin',
        roles : 'admin',
        name: 'Nicolas',
        username: 'nicolas',
        firstname: 'Nicolas',
        lastname: 'Eberle',
        laboratory: 'ECM',
        email: 'nicolas@example.com',
        password: 'nicolas',
        avatar: '/static/img/Nicolas_Eberle.png',
        field: 'Physics'
      }, {
        provider: 'local',
        role: 'admin',
        roles : ['admin'],
        name: 'Admin',
        username: 'admin',
        firstname: 'admin',
        lastname: 'admin',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'admin@example.com',
        password: 'admin',
        avatar: '/static/img/Defaut.png',
        field: 'Administrator'
      }, {
        provider: 'local',
        role: 'user',
        roles : ['user'],
        name: 'Michael',
        username: 'Michael',
        firstname: 'Michael',
        lastname: 'Rera',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'michael@example.com',
        password: 'michael',
        avatar: '/static/img/Michael_Rera.png',
        field: 'Biology'
      }, {
        provider: 'local',
        role: 'editor',
        roles : ['editor'],
        name: 'Bill',
        username: 'bill',
        firstname: 'Bill',
        lastname: 'Gates',
        laboratory: 'MIT, US',
        email: 'bill@example.com',
        password: 'bill',
        avatar: '/static/img/Bill_Gates.jpeg',
        field: 'Biology'
      }, {
        provider: 'local',
        role: 'user',
        roles : ['admin'],
        name: 'Emilie',
        username: 'Dambroise Mugniery',
        firstname: 'Emilie',
        lastname: 'Dambroise Mugniery',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'emilie@example.com',
        password: 'emilie',
        avatar: '/static/img/Emilie_Dambroise_Mugniery.png',
        field: 'Biology'
      }, {
        provider: 'local',
        role: 'user',
        roles : ['admin'],
        name: 'Hervé',
        username: 'Hervé',
        firstname: 'Hervé',
        lastname: 'Tricoire',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'herve@example.com',
        password: 'herve',
        avatar: '/static/img/Herve_Tricoire.png',
        field: 'Biology'
      },{
        provider: 'local',
        role: 'user',
        roles : 'admin',
        name: 'corentin',
        username: 'Corentin',
        firstname: 'Corentin',
        lastname: 'Herbert',
        laboratory: 'ENS Lyon',
        email: 'corentin@example.com',
        password: 'corentin',
        avatar: 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png',
        field: 'Climatology'
      },{
        provider: 'local',
        role: 'user',
        roles : ['admin'],
        name: 'alexandre',
        firstname: 'Alexandre',
        username: 'Alexandre',
        lastname: 'Delga',
        laboratory: '',
        email: 'alex@example.com',
        password: 'alex',
        avatar: 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png',
        field: 'Physics'
      },{
        provider: 'local',
        role: 'user',
        roles : ['admin'],
        name: 'anne-laure',
        firstname: 'Anne-Laure',
        username: 'Anne-Laure',
        lastname: 'Delga',
        laboratory: 'Faculté de Bordeaux',
        email: 'annelaure@example.com',
        password: 'annelaure',
        avatar: 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png',
        field: 'Spanish'
      });
      return users;
    })
      .then((users) => {console.log('finished populating users');})
      .catch(err => console.log('error populating users', err));
}
