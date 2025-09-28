
# Custom Caffe – Next.js + Google Sheets + Discord

## Installer
1) `npm i`
2) Variables d'env (Vercel ou `.env.local`) :
```
GOOGLE_SHEET_ID=VOTRE_ID
GOOGLE_SERVICE_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
DISCORD_ROLE_ID=1393974498172080199
```
3) Partager le Google Sheet avec le **service account** (éditeur).

## Démarrer
- `npm run dev` puis http://localhost:3000
- Login: selon onglet **Admins** ou **Entreprises** de votre Google Sheet.

## Onglets requis (ligne 1 = en-têtes)
- **Entreprises**: `Entreprise | Code | Login | Password | ModeTarif | Facteur | Actif`
- **Produits**: `Clé | Libellé | PrixBase | Catégorie | Image | PrixAncien`
- **CodesPromos** (optionnel): `CodePromo | Type | Valeur | Actif | Libellé`
- **Admins**: `Login | Password`
- **Paramètres** (optionnel): `Clé | Valeur`
- **Commandes**: `ID | Horodatage | Entreprise | Contact | Articles(JSON) | SousTotal | Remise | Total | Statut`
