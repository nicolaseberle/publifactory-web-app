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
            authors: [user_tmp[1]._id,user_tmp[2]._id],
            reviewers : [user_tmp[4]._id,user_tmp[5]._id],
            published: true,
            status: 'Reviewing',
            doi: '10.1073/pnas.1215849110',

          }, {
            title: 'New Article 2',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            authors: [user_tmp[1]._id,user_tmp[3]._id],
            reviewers : [user_tmp[2]._id,user_tmp[4]._id],
            published: true,
            status: 'Reviewing',
            doi: '10.1073/pnas.1215849110',

          }, {
            title: 'New Article 3',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            authors: [user_tmp[1]._id,user_tmp[3]._id],
            published: true,
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
        name: 'Nicolas',
        username: 'nicolas',
        lastName: 'Eberle',
        laboratory: 'ECM',
        email: 'nicolas@example.com',
        password: 'nicolas',
        avatar: '/assets/images/fake/Nicolas_Eberle.png',
        field: 'Physics'
      }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        username: 'admin',
        lastName: 'admin',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'admin@example.com',
        password: 'admin',
        avatar: '/assets/images/fake/Defaut.png',
        field: 'Administrator'
      }, {
        provider: 'local',
        role: 'user',
        name: 'Michael',
        username: 'Michael',
        lastName: 'Rera',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'michael@example.com',
        password: 'michael',
        avatar: '/assets/images/fake/Michael_Rera.png',
        field: 'Biology'
      }, {
        provider: 'local',
        role: 'user',
        name: 'Bill',
        username: 'Bill',
        lastName: 'Gates',
        laboratory: 'MIT, US',
        email: 'bill@example.com',
        password: 'bill',
        avatar: '/assets/images/fake/Bill_Gates.jpeg',
        field: 'Biology'
      }, {
        provider: 'local',
        role: 'user',
        name: 'Emilie',
        username: 'Dambroise Mugniery',
        lastName: 'Emilie',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'emilie@example.com',
        password: 'emilie',
        avatar: '/assets/images/fake/Emilie_Dambroise_Mugniery.png',
        field: 'Biology'
      }, {
        provider: 'local',
        role: 'user',
        name: 'Hervé',
        username: 'Hervé',
        lastName: 'Tricoire',
        laboratory: 'Laboratory of Degenerative Processes, Stress and Aging, UMR8251, Université Paris Diderot, Paris 75013, France.',
        email: 'herve@example.com',
        password: 'herve',
        avatar: '/assets/images/fake/Herve_Tricoire.png',
        field: 'Biology'
      },{
        provider: 'local',
        role: 'user',
        name: 'corentin',
        username: 'Corentin',
        lastName: 'Herbert',
        laboratory: 'ENS Lyon',
        email: 'corentin@example.com',
        password: 'corentin',
        avatar: '/assets/images/fake/Defaut.png',
        field: 'Climatology'
      },{
        provider: 'local',
        role: 'user',
        name: 'anne-laure',
        username: 'Anne-Laure',
        lastName: 'Delga',
        laboratory: 'Faculté de Bordeaux',
        email: 'annelaure@example.com',
        password: 'annelaure',
        avatar: '/assets/images/fake/Defaut.png',
        field: 'Spanish'
      });
      return users;
    })
      .then((users) => {console.log('finished populating users');})
      .catch(err => console.log('error populating users', err));
}
