import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials to sync with the website database
const supabaseUrl = ''; 
const supabaseAnonKey = ''; 

// If credentials are provided, create the real client
const realClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Clean, simulated database to enable perfect offline demonstration when Supabase is not configured yet
const dummyClient = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error("Supabase credentials not configured.") }),
    getSession: async () => ({ data: { session: null } }),
    signOut: async () => {},
  },
  from: (table) => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      order: () => chain,
      then: (onfulfilled) => {
        // Fallback static high-quality mock data matching the website database structure
        let data = [];
        if (table === 'hero_banners') {
          data = [
            {
              id: 1,
              title: "Royal Heritage",
              subtitle: "The Rajputana Collection",
              description: "Indulge in royal 22K gold chokers and necklace sets handcrafted by hereditary Karigars.",
              desktop_image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
              luxury_tag: "Royal Heritage",
              cta_text: "Explore Collection"
            },
            {
              id: 2,
              title: "The Art of Rings",
              subtitle: "Elegance & Detail",
              description: "Exquisite 22K gold rings featuring delicate Rajasthani Nakshi artwork and royal Rajputana motifs.",
              desktop_image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=1200&auto=format&fit=crop",
              luxury_tag: "Elegance & Detail",
              cta_text: "Explore Rings"
            },
            {
              id: 3,
              title: "Ethereal Diamonds",
              subtitle: "Rare & Majestic",
              description: "Stunning VVS1 clarity diamond bracelets set in 18K premium white gold for timeless luxury.",
              desktop_image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop",
              luxury_tag: "VVS1 Certified",
              cta_text: "Discover Diamonds"
            }
          ];
        } else if (table === 'products') {
          data = [
            {
              id: 1,
              title: "Rajputana Royal Gold Necklace",
              category: "Gold Jewellery",
              collection: "Rajputana Royal Heritage",
              price: "₹ 1,85,000",
              description: "Handcrafted 22K gold choker featuring traditional Kundan work and delicate pearls.",
              images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"],
              tags: "gold, necklace, royal, kundan"
            },
            {
              id: 2,
              title: "Polki Diamond Jadau Bangle",
              category: "Diamond Jewellery",
              collection: "Polki Heritage",
              price: "₹ 2,45,000",
              description: "Stunning uncut diamond jadau bangle featuring fine meenakari work on the reverse.",
              images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"],
              tags: "diamond, bangle, polki, jadau"
            },
            {
              id: 3,
              title: "Nakshi Gold Wedding Ring",
              category: "Gold Jewellery",
              collection: "Royal Rajputana",
              price: "₹ 65,000",
              description: "Exquisite 22K gold wedding ring with micro-engraving showcasing Nakshi artwork.",
              images: ["https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=600&auto=format&fit=crop"],
              tags: "gold, ring, nakshi, royal"
            },
            {
              id: 4,
              title: "Victorian Diamond Choker Set",
              category: "Diamond Jewellery",
              collection: "Bridal Collection",
              price: "₹ 6,50,000",
              description: "Grand Victorian-era inspired necklace set with premium brilliant-cut certified diamonds.",
              images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop"],
              tags: "diamond, necklace, bridal, victorian"
            },
            {
              id: 5,
              title: "Solid 24K Gold Coin (10g)",
              category: "Bullion",
              collection: "Pure Gold Coins",
              price: "₹ 74,500",
              description: "10-gram 24K pure gold coin with BIS 999 certified assay packaging for investment.",
              images: ["https://images.unsplash.com/photo-1610660600122-bd885de5eaaf?q=80&w=600&auto=format&fit=crop"],
              tags: "gold, coin, bullion, investment"
            }
          ];
        }
        return Promise.resolve({ data, error: null }).then(onfulfilled);
      }
    };
    return chain;
  }
};

export const supabase = realClient || dummyClient;
