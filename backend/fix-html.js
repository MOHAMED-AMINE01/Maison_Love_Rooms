const fs = require('fs');
const filePath = 'C:/ALTERNANCE/Maison_Love_Room/backend/src/controllers/adminController.ts';
let content = fs.readFileSync(filePath, 'utf8');

const newHtml = `    const htmlContent = \`
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #c7a17a;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: 'Times New Roman', Times, serif; color: #c7a17a; font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Maison Love Room</h1>
          <p style="color: #c7a17a; font-size: 12px; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;">Nouveau Message</p>
        </div>
        
        <div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin: 0 0 15px 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Nom du client :</strong><br/><span style="font-size: 16px; margin-top: 5px; display: inline-block;">\${name}</span></p>
          <p style="margin: 0 0 15px 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Email de contact :</strong><br/><a href="mailto:\${email}" style="color: #ffffff; text-decoration: none; font-size: 16px; margin-top: 5px; display: inline-block;">\${email}</a></p>
          <p style="margin: 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Sujet de la demande :</strong><br/><span style="font-size: 16px; margin-top: 5px; display: inline-block;">\${subject || 'Non spécifié'}</span></p>
        </div>
        
        <div style="border-top: 1px solid rgba(199, 161, 122, 0.3); padding-top: 30px;">
          <strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; display: block; margin-bottom: 15px;">Message :</strong>
          <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #e0e0e0; margin: 0; padding: 20px; background-color: rgba(0,0,0,0.3); border-left: 3px solid #c7a17a; border-radius: 4px;">\${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="color: #888; font-size: 11px;">Cet email a été envoyé depuis le formulaire de contact de Maison Love Room.</p>
        </div>
      </div>
    \`;`;

const oldRegex = /const htmlContent = `[\s\S]*?`;/;
content = content.replace(oldRegex, newHtml);
fs.writeFileSync(filePath, content);
console.log('HTML template replaced successfully!');
