export interface ClientConfig {
  key: string;
  name: string;
  logo: string;
  tagline: string;
  bgImage: string;
  primaryColor: string;
  assistantId: string;
  voiceId: string;
  images: {
    default: string;
    [key: string]: string;
  };
}

export const clients: Record<string, ClientConfig> = {
  apas: {
    key: "apas",
    name: "My Home Apas",
    logo: "My Home <span style='color:#00d4ff'>Apas</span>",
    tagline: "The Water Element of Kokapet",
    bgImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2070",
    primaryColor: "#00d4ff",
    assistantId: "320adb5f-8ac2-4a36-a48f-4a248aff9090",
    voiceId: "sarah",
    images: {
      default: "https://via.placeholder.com/1080x1920?text=Master+Plan",
    },
  },

  asbl_loft: {
    key: "asbl_loft",
    name: "ASBL Loft",
    logo: "ASBL <span style='color:#ff6b35'>Loft</span>",
    tagline: "Luxury 3 BHKs at Financial District",
    bgImage: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070",
    primaryColor: "#ff6b35",
    assistantId: "925e50c8-3973-4984-a5e5-382cc990a6b3",
    voiceId: "sarah",
    images: {
      default: "/images/asbl_master.jpg",
      masterplan: "/images/asbl_master.jpg",
      "1695": "/images/asbl_1695.jpg",
      "1690": "/images/asbl_1695.jpg",
      east: "/images/asbl_1695.jpg",
      "1870": "/images/asbl_1870.jpg",
      west: "/images/asbl_1870.jpg",
      tower: "/images/asbl_tower.jpg",
      living: "/images/asbl_living.jpg",
    },
  },
};
