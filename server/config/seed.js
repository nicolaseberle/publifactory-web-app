/**
 * Populate DB with admin user data on server start
 */

'use strict'

var User = require('../api/user/user.model')
var Article = require('../api/article/article.model');
var Comments = require('../api/comment/comment.model');

const gen_text = '<p>Hoc inmaturo interitu ipse quoque sui pertaesus excessit e vita aetatis nono anno atque vicensimo cum quadriennio imperasset. natus apud Tuscos in Massa Veternensi, patre Constantio Constantini fratre imperatoris, matreque Galla sorore Rufini et Cerealis, quos trabeae consulares nobilitarunt et praefecturae.</p>';
const gen_text_2 = '<p>Haec et huius modi quaedam innumerabilia ultrix facinorum impiorum bonorumque praemiatrix aliquotiens operatur Adrastia atque utinam semper quam vocabulo duplici etiam Nemesim appellamus: ius quoddam sublime numinis efficacis, humanarum mentium opinione lunari circulo superpositum, vel ut definiunt alii, substantialis tutela generali potentia partilibus praesidens fatis, quam theologi veteres fingentes Iustitiae filiam ex abdita quadam aeternitate tradunt omnia despectare terrena.</p><p>Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. in quibus hoc primum est in quo admirer, cur in gravissimis rebus non delectet eos sermo patrius, cum idem fabellas Latinas ad verbum e Graecis expressas non inviti legant. quis enim tam inimicus paene nomini Romano est, qui Ennii Medeam aut Antiopam Pacuvii spernat aut reiciat, quod se isdem Euripidis fabulis delectari dicat, Latinas litteras oderit?</p>';
const figure_1 = '<iframe src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/kmean/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px; margin:10px 10px 10px 10px;"></iframe>'
const figure_2 = '<iframe src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/hello/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;  margin:10px 10px 10px 10px;"></iframe>'
const figure_3 = '<iframe src="http://localhost:3838/app_1/"  style="border: 1px solid #AAA; width:100%; height:540px;  margin:10px 10px 10px 10px;"></iframe>'
const figure_4 = '<iframe src="http://localhost:3838/app_2/"  style="border: 1px solid #AAA; width:100%; height:540px;  margin:10px 10px 10px 10px;"></iframe>'
const figure_5 = '<iframe src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/table/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;  margin:10px 10px 10px 10px;"></iframe>'
const figure_6 = '<iframe src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/boxplot/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;  margin:10px 10px 10px 10px;"></iframe>'


// search for admin user, if no, create one
User.find({}, function (err, users) {
  if (err) throw err
  if(!users){users = createUsers()}
  createComment(users);
  createArticles(users);

})

function createComment(user_tmp) {
  Comments.find({}).remove()
    .then(() => {
      let comments = Comments.create(
      {
        userId: [user_tmp[1]._id],
        content: 'ceci est un commentaire'
      },
      {
        userId: [user_tmp[1]._id],
        content: 'ceci est un autre commentaire'
      });
  })
  .then(() => {console.log('finished populating comments');})
  .catch(err => console.log('error populating comments', err));

}

function createArticles(user_tmp,comment_tmp) {
    Article.find({}).remove()
        .then(() => {
          let comments = Comments.create(
          {
            userId: [user_tmp[1]._id],
            content: 'ceci est un commentaire'
          },
          {
            userId: [user_tmp[1]._id],
            content: 'ceci est un autre commentaire'
          });
          let article = Article.create(
          {
            title: 'Intestinal barrier dysfunction links metabolic and inflammatory markers of aging to death in Drosophila',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            tags:['Aging','death rates','curve fitting'],
            authors: [user_tmp[8]._id,user_tmp[2]._id],
            reviewers : [user_tmp[4]._id,user_tmp[5]._id],
            published: true,
            content: gen_text,
            arr_content: [{
                            title:"Introduction",
                            content: gen_text,
                            path_figure: ''
                          },
                          {
                            title:"Results",
                            content: gen_text_2,
                            path_figure: figure_6
                          },
                          {
                            title:"Conclusion",
                            content: gen_text,
                            path_figure: ''
                          }],
            status: 'Reviewing',
            doi: '10.1073/pnas.1215849110',

          }, {
            title: 'Genetic variation within genes associated with mitochondrial function is significantly associated with later age at onset of Parkinson disease and contributes to disease risk',
            abstract: "Aging is characterized by a growing risk of disease and death, yet the underlying pathophysiology is poorly understood. Indeed, little is known about how the functional decline of individual...",
            authors: [user_tmp[6]._id,user_tmp[8]._id],
            reviewers : [user_tmp[2]._id,user_tmp[4]._id],
            published: true,
            content: gen_text,
            tags:['Aging','death rates','curve fitting'],
            arr_content: [{
                            title:"Introduction",
                            content: gen_text_2,
                            path_figure: figure_1
                          },
                          {
                            title:"Results",
                            content: gen_text,
                            path_figure: figure_2
                          },
                          {
                            title:"Conclusion",
                            content: gen_text,
                            path_figure: ""
                          }],
            status: 'Reviewing',
            doi: '10.1073/pnas.1215849110',

          }, {
            title: 'Bayesian decision theoretic design of two-founder experimental crosses given diallel data',
            abstract: "In designing experimental crosses of inbred strains of model organisms, researchers must make a number of decisions. These include the selection of the appropriate strains, the cross design (F2 intercross), and the number of progeny to collect (sample size). These decisions strongly influence the potential for a successful quantitative trait locus (QTL) mapping experiment; good design decisions will lead to efficient and effective science. Thus experimental design deserves careful consideration and planning. Experimental outcomes can be quantified through utility functions using a Bayesian decision theoretic approaches. For QTL mapping experiments, the power to map a QTL is an appealing utility function to maximize. Using any utility function to aid in experimental design will be dependent on assumptions, such as the QTL effect size in the case of power. Rather than arbitrarily selecting QTL effect size values, they can be estimated from pilot data using a Bayesian hierarchical model. The information in the pilot data can be propagated to the utility function, using Markov Chain Monte Carlo (MCMC) to sample from the posterior distribution. Key features of this approach include: 1) distributional summaries of utility, which are preferable to point estimates, and 2) a comprehensive search of the experimental space of crosses of inbred lines for well-designed experiments. We evaluate this Bayesian theoretic approach using diallel crosses as the pilot data. We present results from simulations as well as present examples from both Mendelian and complex traits in the founder strains of the mouse Collaborative Cross. All analyses were performed using our R package, DIDACT (Diallel-Informed Decision theoretic Approach for Crosses Tool), developed to perform Bayesian cross selection based on diallel pilot data.",
            authors: [user_tmp[5]._id,user_tmp[2]._id],
            arr_content: [{
                            title:"Introduction",
                            content: gen_text_2,
                            path_figure: ''
                          }],
            published: true,
            content: gen_text,
            status: 'Draft',
            tags:['Aging','death rates','curve fitting'],
            doi: '',

          },
          {
            title: 'The Elongator Complex is Required to Maintain Locomotor Healthspan in Caenorhabditis elegans',
            abstract: "An inherited mutation is not always immediately toxic. Some mutations cause symptoms during youth, while other mutations cause symptoms during adulthood. Mutant animals that show delayed onset of disease symptoms may provide insights into mechanisms that maintain functional capacities during adulthood. Here, we take advantage of the relatively short lifespan of the nematode Caenorhabditis elegans and develop a novel screening procedure to collect mutants with locomotor deficits that become apparent in adulthood. After ethyl methanesulfonate mutagenesis, we isolated five C. elegans mutant strains that progressively lose adult locomotor activity. In one of the mutant strains, a nonsense mutation in Elongator Complex Protein Component 2 (elpc-2) causes a progressive decline in locomotor function. Other C. elegans elpc mutants were also unable to maintain locomotor function during adulthood, indicating that the Elongator complex plays a critical role in maintaining locomotor healthspan in C. elegans.",
            authors: [user_tmp[5]._id,user_tmp[2]._id],
            published: true,
            content: gen_text,
            arr_content: [{
                            title:"Introduction",
                            content: gen_text,
                            path_figure: ''
                          }],
            status: 'Submited',
            tags:['Aging','death rates','curve fitting'],
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
        roles : ['user'],
        name: 'Caterina',
        username: 'caterina',
        firstname: 'Caterina',
        lastname: 'Cicognani',
        laboratory: 'Universita Aldo Rossi, Italy',
        email: 'caterina@example.com',
        password: 'caterina',
        avatar: '/static/img/Defaut.png',
        field: 'Architecture'
      },
       {
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
