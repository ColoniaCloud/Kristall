const fs = require('fs');

// ── nuevas claves ──────────────────────────────────────────────────────────

const newKeys = {
  es: {
    products_page: {
      hero_label: "Catálogo de productos",
      hero_headline: "Tecnología alemana para cada aplicación",
      hero_subheadline: "Seis líneas de producto diseñadas para el instalador profesional. Cada referencia con especificaciones verificables y garantía de marca.",
      filter_linea: "Línea",
      filter_todas: "Todas",
      filter_vlt: "VLT",
      filter_uv: "UV",
      filter_todos: "Todos",
      filter_sin_vlt: "Sin VLT",
      filter_sin_uv: "Sin UV",
      filter_count_one: "1 producto",
      filter_count_other: "{count} productos",
      filter_empty: "No hay productos que coincidan con los filtros seleccionados.",
      filter_clear: "Limpiar filtros"
    },
    product_actions: {
      coming_soon_badge: "Próximamente disponible",
      coming_soon_body: "Este producto estará disponible próximamente. Consultá por preventas.",
      consult_availability: "Consultar disponibilidad",
      request_quote: "Solicitar cotización",
      ref_label: "Ref:",
      added_to_list: "Agregado a la lista",
      add_to_list: "Agregar a lista de cotización",
      items_in_list_one: "1 producto en tu lista de cotización",
      items_in_list_other: "{count} productos en tu lista de cotización",
      no_charge: "Sin cargo. Respondemos en menos de 24 hs.",
      modal_title: "Solicitar cotización",
      modal_quote_for: "Estás por cotizar {name} ({sku}).",
      modal_confirm_question: "¿Querés agregar más productos a esta cotización?",
      modal_confirm_body: "Podés armar un lote con varios productos y enviarlo todo junto.",
      modal_yes_label: "Sí, quiero agregar más productos",
      modal_yes_sub: "Se agrega a tu lista de cotización",
      modal_no_label: "No, cotizar solo este producto",
      modal_no_sub: "Completás un formulario rápido",
      back: "← Volver",
      form_title: "Tus datos",
      form_quote_for: "Cotización para:",
      field_name: "Nombre *",
      field_name_placeholder: "Tu nombre",
      field_company: "Empresa",
      field_company_placeholder: "Tu empresa (opcional)",
      field_email: "Email *",
      field_email_placeholder: "tu@empresa.com",
      field_phone: "Teléfono",
      field_phone_placeholder: "+54 11 0000-0000",
      field_message: "Mensaje",
      field_message_placeholder: "Cantidad, uso previsto, consultas adicionales...",
      submit: "Enviar solicitud",
      submitting: "Enviando solicitud...",
      success_title: "¡Solicitud enviada!",
      success_body: "Recibimos tu consulta sobre {name}. Te contactamos en menos de 24 horas.",
      close: "Cerrar",
      error_name: "Nombre requerido",
      error_email: "Email inválido"
    },
    product_slug: {
      breadcrumb_products: "Productos",
      spec_vlt: "VLT (Transmitancia de luz visible)",
      spec_uv: "Bloqueo UV",
      spec_irr: "Rechazo calor infrarrojo",
      spec_sku: "SKU / Referencia",
      spec_availability: "Disponibilidad",
      spec_in_stock: "En stock",
      spec_coming_soon: "Próximamente",
      section_description: "Descripción",
      section_specs: "Especificaciones técnicas",
      line_label: "Línea de producto",
      see_line: "Ver toda la línea →"
    }
  },
  en: {
    products_page: {
      hero_label: "Product catalog",
      hero_headline: "German technology for every application",
      hero_subheadline: "Six product lines designed for the professional installer. Every reference with verifiable specifications and brand warranty.",
      filter_linea: "Line",
      filter_todas: "All",
      filter_vlt: "VLT",
      filter_uv: "UV",
      filter_todos: "All",
      filter_sin_vlt: "No VLT",
      filter_sin_uv: "No UV",
      filter_count_one: "1 product",
      filter_count_other: "{count} products",
      filter_empty: "No products match the selected filters.",
      filter_clear: "Clear filters"
    },
    product_actions: {
      coming_soon_badge: "Coming soon",
      coming_soon_body: "This product will be available soon. Contact us for pre-orders.",
      consult_availability: "Check availability",
      request_quote: "Request quote",
      ref_label: "Ref:",
      added_to_list: "Added to list",
      add_to_list: "Add to quote list",
      items_in_list_one: "1 product in your quote list",
      items_in_list_other: "{count} products in your quote list",
      no_charge: "No charge. We respond within 24 h.",
      modal_title: "Request quote",
      modal_quote_for: "You are about to quote {name} ({sku}).",
      modal_confirm_question: "Would you like to add more products to this quote?",
      modal_confirm_body: "You can build a batch with multiple products and send them all together.",
      modal_yes_label: "Yes, I want to add more products",
      modal_yes_sub: "It will be added to your quote list",
      modal_no_label: "No, quote only this product",
      modal_no_sub: "You will fill out a quick form",
      back: "← Back",
      form_title: "Your details",
      form_quote_for: "Quote for:",
      field_name: "Name *",
      field_name_placeholder: "Your name",
      field_company: "Company",
      field_company_placeholder: "Your company (optional)",
      field_email: "Email *",
      field_email_placeholder: "you@company.com",
      field_phone: "Phone",
      field_phone_placeholder: "+1 000 000-0000",
      field_message: "Message",
      field_message_placeholder: "Quantity, intended use, additional questions...",
      submit: "Send request",
      submitting: "Sending request...",
      success_title: "Request sent!",
      success_body: "We received your inquiry about {name}. We will contact you within 24 hours.",
      close: "Close",
      error_name: "Name required",
      error_email: "Invalid email"
    },
    product_slug: {
      breadcrumb_products: "Products",
      spec_vlt: "VLT (Visible Light Transmittance)",
      spec_uv: "UV Block",
      spec_irr: "Infrared Heat Rejection",
      spec_sku: "SKU / Reference",
      spec_availability: "Availability",
      spec_in_stock: "In stock",
      spec_coming_soon: "Coming soon",
      section_description: "Description",
      section_specs: "Technical specifications",
      line_label: "Product line",
      see_line: "View full line →"
    }
  },
  de: {
    products_page: {
      hero_label: "Produktkatalog",
      hero_headline: "Deutsche Technologie für jede Anwendung",
      hero_subheadline: "Sechs Produktlinien für den professionellen Installateur. Jede Referenz mit nachprüfbaren Spezifikationen und Markengarantie.",
      filter_linea: "Linie",
      filter_todas: "Alle",
      filter_vlt: "VLT",
      filter_uv: "UV",
      filter_todos: "Alle",
      filter_sin_vlt: "Kein VLT",
      filter_sin_uv: "Kein UV",
      filter_count_one: "1 Produkt",
      filter_count_other: "{count} Produkte",
      filter_empty: "Keine Produkte entsprechen den ausgewählten Filtern.",
      filter_clear: "Filter zurücksetzen"
    },
    product_actions: {
      coming_soon_badge: "Demnächst verfügbar",
      coming_soon_body: "Dieses Produkt ist bald erhältlich. Kontaktieren Sie uns für Vorbestellungen.",
      consult_availability: "Verfügbarkeit anfragen",
      request_quote: "Angebot anfordern",
      ref_label: "Ref:",
      added_to_list: "Zur Liste hinzugefügt",
      add_to_list: "Zur Angebotsliste hinzufügen",
      items_in_list_one: "1 Produkt in Ihrer Angebotsliste",
      items_in_list_other: "{count} Produkte in Ihrer Angebotsliste",
      no_charge: "Kostenlos. Wir antworten innerhalb von 24 Std.",
      modal_title: "Angebot anfordern",
      modal_quote_for: "Sie fordern ein Angebot für {name} ({sku}) an.",
      modal_confirm_question: "Möchten Sie weitere Produkte zu diesem Angebot hinzufügen?",
      modal_confirm_body: "Sie können mehrere Produkte zusammenstellen und gemeinsam anfragen.",
      modal_yes_label: "Ja, ich möchte weitere Produkte hinzufügen",
      modal_yes_sub: "Wird Ihrer Angebotsliste hinzugefügt",
      modal_no_label: "Nein, nur dieses Produkt anfragen",
      modal_no_sub: "Sie füllen ein kurzes Formular aus",
      back: "← Zurück",
      form_title: "Ihre Daten",
      form_quote_for: "Angebot für:",
      field_name: "Name *",
      field_name_placeholder: "Ihr Name",
      field_company: "Unternehmen",
      field_company_placeholder: "Ihr Unternehmen (optional)",
      field_email: "E-Mail *",
      field_email_placeholder: "sie@unternehmen.de",
      field_phone: "Telefon",
      field_phone_placeholder: "+49 000 000-0000",
      field_message: "Nachricht",
      field_message_placeholder: "Menge, Verwendungszweck, weitere Fragen...",
      submit: "Anfrage senden",
      submitting: "Wird gesendet...",
      success_title: "Anfrage gesendet!",
      success_body: "Wir haben Ihre Anfrage zu {name} erhalten. Wir melden uns innerhalb von 24 Stunden.",
      close: "Schließen",
      error_name: "Name erforderlich",
      error_email: "Ungültige E-Mail"
    },
    product_slug: {
      breadcrumb_products: "Produkte",
      spec_vlt: "VLT (Sichtbare Lichttransmission)",
      spec_uv: "UV-Blockierung",
      spec_irr: "Infrarotwärme-Abstoßung",
      spec_sku: "SKU / Referenz",
      spec_availability: "Verfügbarkeit",
      spec_in_stock: "Auf Lager",
      spec_coming_soon: "Demnächst",
      section_description: "Beschreibung",
      section_specs: "Technische Daten",
      line_label: "Produktlinie",
      see_line: "Gesamte Linie ansehen →"
    }
  }
};

// ── keys para namespaces existentes (about, footer, hero) ──────────────────

const aboutAdditions = {
  es: {
    brand_history_label: "Historia de la marca",
    brand_history_title: "Más de 20 años fabricando precisión.",
    brand_history_body1: "Kristall trabaja junto a fábricas especializadas en soluciones de control solar, seguridad y protección de superficies, integrando tecnologías multicapa, rechazo térmico y herramientas digitales orientadas al mercado profesional.",
    brand_history_body2: "Más de dos décadas de experiencia en fabricación de películas técnicas para aplicaciones automotrices y arquitectónicas respaldan cada referencia del catálogo.",
    tech_spec_uv: "Bloqueo UV",
    tech_spec_ir: "Rechazo IR (línea KERAMX)",
    tech_spec_thickness: "Grosor de lámina",
    tech_spec_warranty: "Garantía de color",
    tech_spec_adhesive: "Adhesivo",
    tech_bar_clarity: "Claridad óptica",
    tech_bar_solar: "Rechazo solar total",
    tech_bar_ir: "Bloqueo infrarrojo",
    tech_bar_durability: "Durabilidad",
    layer_1_name: "Hard coat exterior",
    layer_1_desc: "Resistencia a rayones",
    layer_2_name: "Capa de color / metalizada",
    layer_2_desc: "Control de transmisión",
    layer_3_name: "Filtro IR / UV",
    layer_3_desc: "Bloqueo espectral selectivo",
    layer_4_name: "Polyester base",
    layer_4_desc: "Soporte estructural",
    layer_5_name: "Adhesivo micro-canales",
    layer_5_desc: "Instalación sin burbujas",
    layer_6_name: "Liner de protección",
    layer_6_desc: "Se retira en instalación"
  },
  en: {
    brand_history_label: "Brand history",
    brand_history_title: "Over 20 years of manufacturing precision.",
    brand_history_body1: "Kristall works with specialized factories in solar control, security and surface protection solutions, integrating multilayer technologies, thermal rejection and digital tools for the professional market.",
    brand_history_body2: "More than two decades of experience in manufacturing technical films for automotive and architectural applications back every catalog reference.",
    tech_spec_uv: "UV Block",
    tech_spec_ir: "IR Rejection (KERAMX line)",
    tech_spec_thickness: "Film thickness",
    tech_spec_warranty: "Color warranty",
    tech_spec_adhesive: "Adhesive",
    tech_bar_clarity: "Optical clarity",
    tech_bar_solar: "Total solar rejection",
    tech_bar_ir: "Infrared block",
    tech_bar_durability: "Durability",
    layer_1_name: "Exterior hard coat",
    layer_1_desc: "Scratch resistance",
    layer_2_name: "Color / metallic layer",
    layer_2_desc: "Transmission control",
    layer_3_name: "IR / UV filter",
    layer_3_desc: "Selective spectral blocking",
    layer_4_name: "Polyester base",
    layer_4_desc: "Structural support",
    layer_5_name: "Micro-channel adhesive",
    layer_5_desc: "Bubble-free installation",
    layer_6_name: "Protective liner",
    layer_6_desc: "Removed during installation"
  },
  de: {
    brand_history_label: "Markengeschichte",
    brand_history_title: "Über 20 Jahre Präzisionsfertigung.",
    brand_history_body1: "Kristall arbeitet mit spezialisierten Fabriken für Sonnenschutz-, Sicherheits- und Oberflächenschutzlösungen zusammen und integriert Mehrschichttechnologien, Wärmeabweisung und digitale Werkzeuge für den professionellen Markt.",
    brand_history_body2: "Mehr als zwei Jahrzehnte Erfahrung in der Herstellung technischer Folien für Automobil- und Architekturanwendungen stehen hinter jeder Katalogreferenz.",
    tech_spec_uv: "UV-Blockierung",
    tech_spec_ir: "IR-Abstoßung (KERAMX-Linie)",
    tech_spec_thickness: "Foliendicke",
    tech_spec_warranty: "Farbgarantie",
    tech_spec_adhesive: "Klebstoff",
    tech_bar_clarity: "Optische Klarheit",
    tech_bar_solar: "Gesamte Solarabweisung",
    tech_bar_ir: "Infrarot-Blockierung",
    tech_bar_durability: "Haltbarkeit",
    layer_1_name: "Äußere Hartvergütung",
    layer_1_desc: "Kratzbeständigkeit",
    layer_2_name: "Farb- / Metallschicht",
    layer_2_desc: "Transmissionskontrolle",
    layer_3_name: "IR / UV-Filter",
    layer_3_desc: "Selektive Spektralblockierung",
    layer_4_name: "Polyesterbasis",
    layer_4_desc: "Strukturelle Unterstützung",
    layer_5_name: "Mikrokanal-Klebstoff",
    layer_5_desc: "Blasenfreie Installation",
    layer_6_name: "Schutzliner",
    layer_6_desc: "Wird bei der Installation entfernt"
  }
};

const heroAdditions = {
  es: {
    card1_sku: "KLAR KPRO05",
    card1_label: "Alta protección UV",
    card2_sku: "KRYPTON KS4",
    card2_label: "Calidad nanocerámica de seguridad",
    card3_sku: "PPF",
    card3_label: "Protección transparente de pintura"
  },
  en: {
    card1_sku: "KLAR KPRO05",
    card1_label: "High UV protection",
    card2_sku: "KRYPTON KS4",
    card2_label: "Nanoceramic safety quality",
    card3_sku: "PPF",
    card3_label: "Transparent paint protection"
  },
  de: {
    card1_sku: "KLAR KPRO05",
    card1_label: "Hoher UV-Schutz",
    card2_sku: "KRYPTON KS4",
    card2_label: "Nanoceramic-Sicherheitsqualität",
    card3_sku: "PPF",
    card3_label: "Transparenter Lackschutz"
  }
};

const footerAdditions = {
  es: {
    link_polarizado: "Polarizado vehicular",
    link_seguridad: "Seguridad vehicular",
    link_arquitectura: "Arquitectura",
    link_ppf: "PPF",
    link_polarized_app: "Polarized App",
    link_dashboard: "Dashboard y reportes",
    link_nosotros: "Nosotros",
    link_blog: "Blog",
    link_contacto: "Contacto"
  },
  en: {
    link_polarizado: "Automotive tint",
    link_seguridad: "Safety film",
    link_arquitectura: "Architecture",
    link_ppf: "PPF",
    link_polarized_app: "Polarized App",
    link_dashboard: "Dashboard & reports",
    link_nosotros: "About us",
    link_blog: "Blog",
    link_contacto: "Contact"
  },
  de: {
    link_polarizado: "Kfz-Tönung",
    link_seguridad: "Sicherheitsfolie",
    link_arquitectura: "Architektur",
    link_ppf: "PPF",
    link_polarized_app: "Polarized App",
    link_dashboard: "Dashboard & Berichte",
    link_nosotros: "Über uns",
    link_blog: "Blog",
    link_contacto: "Kontakt"
  }
};

const productsGridAdditions = {
  es: {
    cat_polarizado_name: "Polarizado vehicular",
    cat_polarizado_desc: "Alto rechazo solar, disponible en 5%, 20%, 35% y 50% de transmisión.",
    cat_polarizado_badge: "5 referencias",
    cat_karbon_name: "Polarizado nanocarbon",
    cat_karbon_desc: "Tecnología de nanopartículas de carbono para máximo rechazo solar sin interferencia de señal.",
    cat_karbon_badge: "Nanocarbon",
    cat_keramx_name: "Polarizado nanocerámica",
    cat_keramx_desc: "La mejor tecnología en polarizado: nanocerámica de alto rendimiento con claridad óptica superior.",
    cat_keramx_badge: "Nanocerámica",
    cat_krypton_name: "Seguridad vehicular",
    cat_krypton_desc: "Retención de fragmentos en impacto. Protección para ocupantes.",
    cat_krypton_badge: "3 referencias",
    cat_ppf_name: "Paint protection film",
    cat_ppf_desc: "Protección invisible de pintura contra impactos, rayones y agentes químicos.",
    cat_vitral_name: "Polarizado estructural",
    cat_vitral_desc: "Control solar para vidriados comerciales y residenciales de alta gama."
  },
  en: {
    cat_polarizado_name: "Automotive tint",
    cat_polarizado_desc: "High solar rejection, available in 5%, 20%, 35% and 50% transmission.",
    cat_polarizado_badge: "5 references",
    cat_karbon_name: "Nanocarbon tint",
    cat_karbon_desc: "Carbon nanoparticle technology for maximum solar rejection without signal interference.",
    cat_karbon_badge: "Nanocarbon",
    cat_keramx_name: "Nanoceramic tint",
    cat_keramx_desc: "The best tinting technology: high-performance nanoceramic with superior optical clarity.",
    cat_keramx_badge: "Nanoceramic",
    cat_krypton_name: "Safety film",
    cat_krypton_desc: "Fragment retention on impact. Protection for vehicle occupants.",
    cat_krypton_badge: "3 references",
    cat_ppf_name: "Paint protection film",
    cat_ppf_desc: "Invisible paint protection against impacts, scratches and chemical agents.",
    cat_vitral_name: "Architectural film",
    cat_vitral_desc: "Solar control for high-end commercial and residential glazing."
  },
  de: {
    cat_polarizado_name: "Kfz-Tönung",
    cat_polarizado_desc: "Hohe Solarabweisung, erhältlich in 5%, 20%, 35% und 50% Transmission.",
    cat_polarizado_badge: "5 Referenzen",
    cat_karbon_name: "Nanocarbon-Tönung",
    cat_karbon_desc: "Kohlenstoff-Nanopartikel-Technologie für maximale Solarabweisung ohne Signalstörung.",
    cat_karbon_badge: "Nanocarbon",
    cat_keramx_name: "Nanokeramische Tönung",
    cat_keramx_desc: "Die beste Töntechnologie: hochleistungsfähige Nanokeramik mit überlegener optischer Klarheit.",
    cat_keramx_badge: "Nanokeramisch",
    cat_krypton_name: "Sicherheitsfolie",
    cat_krypton_desc: "Fragmentrückhaltung bei Aufprall. Schutz für Fahrzeuginsassen.",
    cat_krypton_badge: "3 Referenzen",
    cat_ppf_name: "Lackschutzfolie",
    cat_ppf_desc: "Unsichtbarer Lackschutz gegen Aufprall, Kratzer und chemische Einflüsse.",
    cat_vitral_name: "Architekturfolie",
    cat_vitral_desc: "Sonnenschutzkontrolle für hochwertige Gewerbe- und Wohnverglasung."
  }
};

// ── apply to files ─────────────────────────────────────────────────────────

const langs = ['es', 'en', 'de'];

for (const lang of langs) {
  const path = `c:/Users/JMGarrido/kristall-web/i18n/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  // new top-level namespaces
  data.products_page = newKeys[lang].products_page;
  data.product_actions = newKeys[lang].product_actions;
  data.product_slug = newKeys[lang].product_slug;

  // merge into existing namespaces
  Object.assign(data.about, aboutAdditions[lang]);
  Object.assign(data.hero, heroAdditions[lang]);
  Object.assign(data.footer, footerAdditions[lang]);
  Object.assign(data.products, productsGridAdditions[lang]);

  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ ${lang}.json`);
}
