# Veto-Care (Animora) - Projet "Build & Ship"

## 📍 Le Mapping de notre Thème
**Thème Choisi :** Clinique Vétérinaire ("Veto-Care")
- **Table A (Utilisateurs) :** Les Maîtres (gérés via la table `profiles` avec le rôle `user`).
- **Table B (Ressources) :** Les Vétérinaires (gérés via la table `profiles` avec le rôle `doctor`).
- **Table C (Interactions) :** Les Rendez-vous (`appointments`), reliant le maître et le vétérinaire (et inclut l'animal lié via `pets`).
- **Storage (Fichier) :** Carnet de santé de l'animal ou documents médicaux (radios, ordonnances) uploadés lors de la prise de rendez-vous dans le bucket `medical-files`.

---

## 🏗️ L'Analyse d'Architecture

**1. Pourquoi l'utilisation de Vercel + Supabase est financièrement plus logique qu'un serveur classique ?**
Le choix d'une architecture Serverless (Vercel + Supabase) permet de transformer les coûts d'investissement initial (**CAPEX** - Capital Expenditure) en coûts opérationnels variables (**OPEX** - Operational Expenditure). Avec un serveur classique, nous aurions dû payer un CAPEX élevé pour acheter du matériel (serveurs physiques), configurer le réseau, et payer un loyer fixe dans un Data Center, même si l'application n'a pas de trafic.
Grâce à Vercel et Supabase, nous fonctionnons sur un modèle "Pay-as-you-go" (OPEX). Nous ne payons que pour les ressources réellement consommées (temps de calcul, requêtes base de données, bande passante). Pour le lancement d'un projet, cela élimine le risque financier et permet de démarrer avec des coûts quasiment nuls (Free Tier).

**2. Comment Vercel gère-t-il la scalabilité par rapport à un Data Center physique local ?**
Dans un Data Center physique, la scalabilité est complexe et lente. En cas de pic de trafic, il faut anticiper l'achat de nouveaux racks de serveurs, gérer l'alimentation électrique, et renforcer la climatisation pour éviter la surchauffe des équipements. 
À l'inverse, Vercel déploie le frontend de l'application sur un réseau mondial (Edge Network/CDN). La scalabilité est **automatique et instantanée**. Si le trafic augmente soudainement, Vercel alloue dynamiquement de nouvelles ressources et distribue le contenu au plus proche des utilisateurs, sans aucune intervention humaine. Nous n'avons pas à nous soucier de l'infrastructure physique.

**3. Qu'est-ce qui représente la donnée Structurée et la donnée Non-structurée dans l'application ?**
- **Données Structurées :** Elles sont stockées dans la base de données relationnelle PostgreSQL de Supabase. Il s'agit des profils utilisateurs, des spécialités des vétérinaires, des détails des animaux (`pets`), et des informations des rendez-vous (dates, statuts, clés étrangères). Elles obéissent à un schéma strict (`supabase_schema.sql`).
- **Données Non-structurées :** Il s'agit des fichiers uploadés par les maîtres lors de la création d'un rendez-vous (scans du carnet de santé, photos de l'animal, ou documents PDF). N'ayant pas de format tabulaire, elles sont stockées dans **Supabase Storage** (Object Storage), tandis qu'un simple lien URL de référence est conservé dans la base de données.
