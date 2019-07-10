'use strict';

const configEmail = require('../../../config.js').email
const nodemailer = require('nodemailer');
const User = require('../user/user.model');

module.exports = class Email {
  constructor(email) {
    this.email = email;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      post: 465,
      secure: true,
      auth: {
        user: configEmail.user,
        pass: configEmail.pass
      }
    })
  }

  sendRecuperationPassword(link) {
    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: 'PubliFactory | Récupération de mot de passe',
      text: "Bonjour,\nVotre lien de récupération de mot de passe est ici : " + link
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error)
      else return console.log('Message sent: %s', info.messageId)
    })
  }

  sendEmailConfirmation(link) {
    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: 'PubliFactory | Confirmation d\'e-mail',
      text: `Bonjour,\nVous trouverez ci-après le lien vous permettant de confirmer votre compte Publifactory :\n${link}\n
      Une fois activé vous disposerez des droits et privilèges utilisateur.`
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error)
      else return console.log('Message sent: %s', info.messageId)
    })
  }

  async sendInvitationCoAuthor (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} a partagé un article avec vous !`,
      text: `Bonjour,\nL'auteur ${author.firstname} ${author.lastname} vous a invité à co-écrire un article.\nVous trouverez l'article ici : ${link}`
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error)
      else return console.log('Message sent: %s', info.messageId)
    })
  }

  async sendInvitationReviewer (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} a besoin de votre révision !`,
      text: `Bonjour,\n
      L'auteur ${author.firstname} ${author.lastname} vous a invité à réviser son article.\n
      Vous trouverez l'article ici : ${link}.`
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error)
      else return console.log('Message sent: %s', info.messageId)
    })
  }

  async sendInvitationJournalUser (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} vous a partagé un journal !`,
      text: `Bonjour,\n
      L'utilisateur ${author.firstname} ${author.lastname} vous a invité à consulté un journal.\n
      Vous trouverez le journal ici : ${link}.`
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error)
      else return console.log('Message sent: %s', info.messageId)
    })
  }

  async sendInvitationCoEditor (authorId, link) {

  }

  async sendInvitationJournalAssociateEditor (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} vous a défini comme éditeur sur un journal !`,
      text: `Bonjour,\n
      L'utilisateur ${author.firstname} ${author.lastname} vous a défini comme un co-éditeur d'un journal.\n
      Vos choix et décisions permettront d'approuver les articles des utilisateurs.\n
      Vous trouverez le journal ici : ${link}.`
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error)
      else return console.log('Message sent: %s', info.messageId)
    })
  }
};
