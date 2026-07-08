const fs = require('fs');
const filePath = 'C:/ALTERNANCE/Maison_Love_Room/backend/src/controllers/adminController.ts';
let content = fs.readFileSync(filePath, 'utf8');
const contactStart = content.indexOf('/* ==========================================================================\n   Contact Form (Public)');

if (contactStart !== -1) {
  content = content.substring(0, contactStart);
}

const cleanFunc = `/* ==========================================================================
   Contact Form (Public)
   ========================================================================== */

// @desc    Gère la soumission du formulaire de contact (envoi d'un email à l'administrateur)
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Veuillez remplir les champs obligatoires (nom, email, message).' });
  }

  try {
    const htmlContent = \`
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #c7a17a;">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> \${name}</p>
        <p><strong>Email :</strong> \${email}</p>
        <p><strong>Objet :</strong> \${subject || 'Non spécifié'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">\${message}</p>
      </div>
    \`;

    await sendEmail({
      to: process.env.EMAIL_USER as string, // L'email de destination (le même que l'expéditeur)
      subject: \`[Contact] \${subject || 'Nouvelle demande'} de \${name}\`,
      html: htmlContent,
      replyTo: email, // Permet à l'admin de répondre directement au client
    });

    res.status(200).json({ message: 'Message envoyé avec succès.' });
  } catch (error: any) {
    console.error('Erreur lors de l\\'envoi du formulaire de contact :', error);
    res.status(500).json({ message: 'Erreur lors de l\\'envoi du message.', error: error.message });
  }
};
`;

fs.writeFileSync(filePath, content + cleanFunc);
console.log('Fixed file successfully!');
