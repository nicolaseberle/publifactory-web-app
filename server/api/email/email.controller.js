'use strict';

const configEmail = require('../../../config.js').email
const User = require('../user/user.model');

module.exports = class Email {
  constructor(email) {
    this.email = email;
  }

  sendRecuperationPassword(link) {
    const gmail = require('gmail-send')({
      user: configEmail.user,
      pass: configEmail.pass,
      to: this.email,
      subject: "PubliFactory | Récupération de mot de passe",
      text: "Bonjour,\nVotre lien de récupération de mot de passe est ici : " + link
    })();
  }

  sendEmailConfirmation(code) {
    const gmail = require('gmail-send')({
      user: configEmail.user,
      pass: configEmail.pass,
      to: this.email,
      subject: "PubliFactory | Confirmation e-mail",
      text: "Voici votre mot de passe à utiliser avec votre compte PubliFactory : " + code + "\n" +
        "Ce mot de passe pourra être modifier dans la section profil de l'application."
    })();
  }

  async sendInvitationCoAuthor (authorId, link) {
    const author = await new Promise(async (resolve, reject) => {
      resolve(await User.findOne({ _id: authorId }));
    });
    const gmail = require('gmail-send')({
      user: configEmail.user,
      pass: configEmail.pass,
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} a partagé un article avec vous !`,
      text: `Bonjour,\nL'auteur ${author.firstname} ${author.lastname} vous a invité à co-écrire un article.\nVous trouverez l'article ici : ${link}`
    })();
  }

  async sendInvitationReviewer (authorId, link) {
    const author = await new Promise(async (resolve, reject) => {
      resolve(await User.findOne({ _id: authorId }));
    });
    const gmail = require('gmail-send')({
      user: configEmail.user,
      pass: configEmail.pass,
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} a besoin de votre révision !`,
      text: `Bonjour,\n
      L'auteur ${author.firstname} ${author.lastname} vous a invité à réviser son article.\n
      Vous trouverez l'article ici : ${link}.`
    })();
  }
};
