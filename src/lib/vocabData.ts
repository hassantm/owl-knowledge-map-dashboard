export type VocabSubject = "History" | "Geography" | "Religion"
export type VocabTerm = "Autumn1" | "Autumn2" | "Spring1" | "Spring2" | "Summer1" | "Summer2"

export interface SubjectMeta {
  name: string
  color: string
  soft: string
  ink: string
}

export interface VocabWord { w: string; u: number }
export interface VocabChapter { n: number; title: string; words: VocabWord[] }
export interface VocabBooklet { id: string; title: string; chapters: VocabChapter[] }
export interface VocabRow {
  year: string
  term: VocabTerm
  cols: Partial<Record<VocabSubject, VocabBooklet[]>>
}
export interface VocabData {
  meta: {
    subjects: Record<VocabSubject, SubjectMeta>
    termLabels: Record<VocabTerm, string>
  }
  rows: VocabRow[]
}

export const VOCAB_DATA: VocabData = {
  "meta": {
    "subjects": {
      "History": {
        "name": "History",
        "color": "#7AA8E8",
        "soft": "#E1ECF9",
        "ink": "#2C4F7C"
      },
      "Geography": {
        "name": "Geography",
        "color": "#86C28A",
        "soft": "#E2F0E4",
        "ink": "#36633A"
      },
      "Religion": {
        "name": "Religion & Worldviews",
        "color": "#E8B547",
        "soft": "#F8EBC9",
        "ink": "#7A5610"
      }
    },
    "termLabels": {
      "Autumn1": "Aut 1",
      "Autumn2": "Aut 2",
      "Spring1": "Spr 1",
      "Spring2": "Spr 2",
      "Summer1": "Sum 1",
      "Summer2": "Sum 2"
    }
  },
  "rows": [
    {
      "year": "3",
      "term": "Autumn1",
      "cols": {
        "History": [
          {
            "id": "ancient-egypt-3autumn1",
            "title": "Ancient Egypt",
            "chapters": [
              {
                "n": 1,
                "title": "Howard Carter gets",
                "words": [
                  {
                    "w": "hieroglyphic",
                    "u": 1
                  },
                  {
                    "w": "archaeologists",
                    "u": 1
                  },
                  {
                    "w": "Tutankhamun",
                    "u": 1
                  },
                  {
                    "w": "Valley of the Kings",
                    "u": 1
                  },
                  {
                    "w": "excavate",
                    "u": 1
                  },
                  {
                    "w": "tomb",
                    "u": 1
                  },
                  {
                    "w": "archaeologist",
                    "u": 1
                  },
                  {
                    "w": "remains",
                    "u": 1
                  },
                  {
                    "w": "ebony",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "Howard Carter gets a big surprise",
                "words": [
                  {
                    "w": "ruler of ancient Egypt",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "How did the ancient Egyptians live?",
                "words": [
                  {
                    "w": "taxes",
                    "u": 2
                  },
                  {
                    "w": "Christ",
                    "u": 2
                  },
                  {
                    "w": "historians",
                    "u": 1
                  },
                  {
                    "w": "civilisation",
                    "u": 1
                  },
                  {
                    "w": "civilisations",
                    "u": 1
                  },
                  {
                    "w": "Nile",
                    "u": 1
                  },
                  {
                    "w": "Mediterranean Sea",
                    "u": 2
                  },
                  {
                    "w": "kingdom",
                    "u": 2
                  },
                  {
                    "w": "Upper Egypt",
                    "u": 1
                  },
                  {
                    "w": "Lower Egypt",
                    "u": 1
                  },
                  {
                    "w": "united",
                    "u": 1
                  },
                  {
                    "w": "crown",
                    "u": 1
                  },
                  {
                    "w": "kingdoms",
                    "u": 1
                  },
                  {
                    "w": "double crown",
                    "u": 1
                  },
                  {
                    "w": "pharaoh",
                    "u": 1
                  },
                  {
                    "w": "enemies",
                    "u": 1
                  },
                  {
                    "w": "priests",
                    "u": 1
                  },
                  {
                    "w": "scribes",
                    "u": 1
                  },
                  {
                    "w": "fertile",
                    "u": 1
                  },
                  {
                    "w": "protected",
                    "u": 1
                  },
                  {
                    "w": "mine",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "How did ancient Egypt change over time?",
                "words": [
                  {
                    "w": "Middle Kingdom",
                    "u": 1
                  },
                  {
                    "w": "Cheops",
                    "u": 1
                  },
                  {
                    "w": "Old Kingdom",
                    "u": 1
                  },
                  {
                    "w": "overpower",
                    "u": 1
                  },
                  {
                    "w": "weapons",
                    "u": 1
                  },
                  {
                    "w": "Amun",
                    "u": 1
                  },
                  {
                    "w": "Giza",
                    "u": 1
                  },
                  {
                    "w": "ankh",
                    "u": 1
                  },
                  {
                    "w": "pyramids",
                    "u": 1
                  },
                  {
                    "w": "chariots",
                    "u": 2
                  },
                  {
                    "w": "New Kingdom",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "What did the ancient Egyptians believe?",
                "words": [
                  {
                    "w": "Isis",
                    "u": 1
                  },
                  {
                    "w": "Osiris",
                    "u": 1
                  },
                  {
                    "w": "Anubis",
                    "u": 1
                  },
                  {
                    "w": "afterlife",
                    "u": 1
                  },
                  {
                    "w": "underworld",
                    "u": 2
                  },
                  {
                    "w": "Ma’at",
                    "u": 1
                  },
                  {
                    "w": "order",
                    "u": 2
                  },
                  {
                    "w": "universe",
                    "u": 1
                  },
                  {
                    "w": "flooded",
                    "u": 1
                  },
                  {
                    "w": "dependent",
                    "u": 1
                  },
                  {
                    "w": "Amun Ra",
                    "u": 1
                  },
                  {
                    "w": "hawk",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "What did ancient Egyptians \u000bbelieve about death?",
                "words": [
                  {
                    "w": "soul",
                    "u": 1
                  },
                  {
                    "w": "decaying",
                    "u": 1
                  },
                  {
                    "w": "limb",
                    "u": 1
                  },
                  {
                    "w": "embalming",
                    "u": 1
                  },
                  {
                    "w": "canopic jars",
                    "u": 1
                  },
                  {
                    "w": "mummy",
                    "u": 1
                  },
                  {
                    "w": "mummification",
                    "u": 1
                  },
                  {
                    "w": "preserve",
                    "u": 1
                  },
                  {
                    "w": "ba",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "How did the ancient Egyptians write?",
                "words": [
                  {
                    "w": "cartouche",
                    "u": 1
                  },
                  {
                    "w": "Rosetta",
                    "u": 1
                  },
                  {
                    "w": "hieroglyphics",
                    "u": 1
                  },
                  {
                    "w": "hieroglyphs",
                    "u": 1
                  },
                  {
                    "w": "inscriptions",
                    "u": 1
                  },
                  {
                    "w": "carved",
                    "u": 1
                  },
                  {
                    "w": "papyrus",
                    "u": 1
                  },
                  {
                    "w": "Rosetta Stone",
                    "u": 1
                  },
                  {
                    "w": "translated",
                    "u": 1
                  },
                  {
                    "w": "Demotic",
                    "u": 1
                  },
                  {
                    "w": "Greek",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "rivers-3autumn1",
            "title": "Rivers",
            "chapters": [
              {
                "n": 1,
                "title": "The mighty River Indus",
                "words": [
                  {
                    "w": "India",
                    "u": 1
                  },
                  {
                    "w": "Indus",
                    "u": 2
                  },
                  {
                    "w": "glaciers",
                    "u": 1
                  },
                  {
                    "w": "monsoon",
                    "u": 1
                  },
                  {
                    "w": "channel",
                    "u": 1
                  },
                  {
                    "w": "Pakistan",
                    "u": 1
                  },
                  {
                    "w": "tributaries",
                    "u": 1
                  },
                  {
                    "w": "Arabian Sea",
                    "u": 1
                  },
                  {
                    "w": "riverbed",
                    "u": 1
                  },
                  {
                    "w": "Himalayas",
                    "u": 1
                  },
                  {
                    "w": "stream",
                    "u": 1
                  },
                  {
                    "w": "Tibet",
                    "u": 1
                  },
                  {
                    "w": "mountain range",
                    "u": 1
                  },
                  {
                    "w": "turbulent",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The changing River Indus",
                "words": [
                  {
                    "w": "parched",
                    "u": 1
                  },
                  {
                    "w": "migrate",
                    "u": 2
                  },
                  {
                    "w": "revive",
                    "u": 1
                  },
                  {
                    "w": "Sindh",
                    "u": 1
                  },
                  {
                    "w": "province",
                    "u": 2
                  },
                  {
                    "w": "palla",
                    "u": 1
                  },
                  {
                    "w": "hydro-electric power",
                    "u": 1
                  },
                  {
                    "w": "turbine",
                    "u": 1
                  },
                  {
                    "w": "irrigate",
                    "u": 1
                  },
                  {
                    "w": "irrigation",
                    "u": 1
                  },
                  {
                    "w": "canals",
                    "u": 1
                  },
                  {
                    "w": "reservoirs",
                    "u": 1
                  },
                  {
                    "w": "dams",
                    "u": 1
                  },
                  {
                    "w": "course",
                    "u": 2
                  },
                  {
                    "w": "river levels",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "How do rivers get their water?",
                "words": [
                  {
                    "w": "surface runoff",
                    "u": 1
                  },
                  {
                    "w": "condenses",
                    "u": 1
                  },
                  {
                    "w": "evaporation",
                    "u": 1
                  },
                  {
                    "w": "evaporates",
                    "u": 1
                  },
                  {
                    "w": "state",
                    "u": 2
                  },
                  {
                    "w": "solid",
                    "u": 1
                  },
                  {
                    "w": "liquid",
                    "u": 1
                  },
                  {
                    "w": "gas",
                    "u": 1
                  },
                  {
                    "w": "water vapour",
                    "u": 1
                  },
                  {
                    "w": "Earth",
                    "u": 1
                  },
                  {
                    "w": "delicacy",
                    "u": 2
                  },
                  {
                    "w": "source",
                    "u": 1
                  },
                  {
                    "w": "spring",
                    "u": 2
                  },
                  {
                    "w": "water cycle",
                    "u": 1
                  },
                  {
                    "w": "atmosphere",
                    "u": 2
                  },
                  {
                    "w": "transpiration",
                    "u": 1
                  },
                  {
                    "w": "groundwater",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "How rivers shape the land:\u000bthe young river",
                "words": [
                  {
                    "w": "V-shaped valley",
                    "u": 1
                  },
                  {
                    "w": "upper course",
                    "u": 1
                  },
                  {
                    "w": "deposition",
                    "u": 1
                  },
                  {
                    "w": "deposits",
                    "u": 1
                  },
                  {
                    "w": "load",
                    "u": 1
                  },
                  {
                    "w": "particles",
                    "u": 1
                  },
                  {
                    "w": "erodes",
                    "u": 1
                  },
                  {
                    "w": "erosion",
                    "u": 1
                  },
                  {
                    "w": "spurs",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "How a river shapes the land:",
                "words": [
                  {
                    "w": "estuary",
                    "u": 1
                  },
                  {
                    "w": "mature",
                    "u": 1
                  },
                  {
                    "w": "mangroves",
                    "u": 1
                  },
                  {
                    "w": "delta",
                    "u": 1
                  },
                  {
                    "w": "reeds",
                    "u": 1
                  },
                  {
                    "w": "mouth",
                    "u": 1
                  },
                  {
                    "w": "meanders",
                    "u": 1
                  },
                  {
                    "w": "sediment",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Britain’s longest river: the River Severn",
                "words": [
                  {
                    "w": "mud flats",
                    "u": 1
                  },
                  {
                    "w": "salmon",
                    "u": 1
                  },
                  {
                    "w": "Pollution",
                    "u": 1
                  },
                  {
                    "w": "WALES",
                    "u": 2
                  },
                  {
                    "w": "pollute",
                    "u": 1
                  },
                  {
                    "w": "conservation",
                    "u": 1
                  },
                  {
                    "w": "sandpipers",
                    "u": 1
                  },
                  {
                    "w": "curlews",
                    "u": 1
                  },
                  {
                    "w": "tide",
                    "u": 1
                  },
                  {
                    "w": "Gloucester",
                    "u": 1
                  },
                  {
                    "w": "bore",
                    "u": 1
                  },
                  {
                    "w": "streamlined",
                    "u": 1
                  },
                  {
                    "w": "cattle",
                    "u": 2
                  },
                  {
                    "w": "River Severn",
                    "u": 1
                  },
                  {
                    "w": "Welsh",
                    "u": 2
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "rama-and-sita-3autumn1",
            "title": "Rama and Sita",
            "chapters": [
              {
                "n": 1,
                "title": "An ancient story",
                "words": [
                  {
                    "w": "Ramayana",
                    "u": 1
                  },
                  {
                    "w": "epic",
                    "u": 2
                  },
                  {
                    "w": "Rama",
                    "u": 1
                  },
                  {
                    "w": "Indus",
                    "u": 2
                  },
                  {
                    "w": "beliefs",
                    "u": 1
                  },
                  {
                    "w": "Hindus.   Hinduism",
                    "u": 1
                  },
                  {
                    "w": "believers",
                    "u": 1
                  },
                  {
                    "w": "deer",
                    "u": 1
                  },
                  {
                    "w": "Lakshmana",
                    "u": 1
                  },
                  {
                    "w": "Sita",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Four sons for the king \u000bof Ayodhya",
                "words": [
                  {
                    "w": "decree",
                    "u": 4
                  },
                  {
                    "w": "embodiment",
                    "u": 1
                  },
                  {
                    "w": "Vishnu",
                    "u": 1
                  },
                  {
                    "w": "prosperous",
                    "u": 3
                  },
                  {
                    "w": "succeed",
                    "u": 1
                  },
                  {
                    "w": "subjects",
                    "u": 2
                  },
                  {
                    "w": "kingdom",
                    "u": 2
                  },
                  {
                    "w": "banish",
                    "u": 1
                  },
                  {
                    "w": "manhood",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Rama and Sita leave the kingdom",
                "words": [
                  {
                    "w": "throne",
                    "u": 1
                  },
                  {
                    "w": "oath",
                    "u": 1
                  },
                  {
                    "w": "companion",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Rama, Sita \u000band the demon Ravana",
                "words": [
                  {
                    "w": "entranced",
                    "u": 1
                  },
                  {
                    "w": "Hanuman",
                    "u": 1
                  },
                  {
                    "w": "demon",
                    "u": 1
                  },
                  {
                    "w": "chariot",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Rama and Sita return",
                "words": [
                  {
                    "w": "Diwali",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Understanding the story \u000bof Rama and Sita",
                "words": [
                  {
                    "w": "symbol",
                    "u": 1
                  },
                  {
                    "w": "path",
                    "u": 1
                  },
                  {
                    "w": "devotion",
                    "u": 1
                  },
                  {
                    "w": "duty",
                    "u": 1
                  },
                  {
                    "w": "order",
                    "u": 2
                  },
                  {
                    "w": "dharma",
                    "u": 1
                  },
                  {
                    "w": "victory",
                    "u": 1
                  },
                  {
                    "w": "worship",
                    "u": 1
                  },
                  {
                    "w": "altar",
                    "u": 2
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "3",
      "term": "Autumn2",
      "cols": {
        "History": [
          {
            "id": "cradles-of-civilisation-3autumn2",
            "title": "Cradles of Civilisation",
            "chapters": [
              {
                "n": 1,
                "title": "The land of the two rivers",
                "words": [
                  {
                    "w": "MESOPOTAMIA",
                    "u": 1
                  },
                  {
                    "w": "trade",
                    "u": 2
                  },
                  {
                    "w": "tablets",
                    "u": 1
                  },
                  {
                    "w": "Sumer",
                    "u": 1
                  },
                  {
                    "w": "Tigris",
                    "u": 1
                  },
                  {
                    "w": "Euphrates",
                    "u": 1
                  },
                  {
                    "w": "weaving",
                    "u": 1
                  },
                  {
                    "w": "herding",
                    "u": 2
                  },
                  {
                    "w": "Fertile Crescent",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Trade, building, writing",
                "words": [
                  {
                    "w": "ziggurat",
                    "u": 1
                  },
                  {
                    "w": "cuneiform",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The Epic of Gilgamesh",
                "words": [
                  {
                    "w": "Assyria",
                    "u": 1
                  },
                  {
                    "w": "Gilgamesh",
                    "u": 1
                  },
                  {
                    "w": "epic",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Cradles of civilisation",
                "words": [
                  {
                    "w": "sacrifices",
                    "u": 2
                  },
                  {
                    "w": "Indus Valley",
                    "u": 1
                  },
                  {
                    "w": "bronze",
                    "u": 1
                  },
                  {
                    "w": "nomadic",
                    "u": 1
                  },
                  {
                    "w": "cradle",
                    "u": 1
                  },
                  {
                    "w": "altar",
                    "u": 2
                  },
                  {
                    "w": "Shang",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Similarities between civilisations",
                "words": [
                  {
                    "w": "decipher",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Art in ancient civilisations",
                "words": [
                  {
                    "w": "sculptures",
                    "u": 2
                  },
                  {
                    "w": "decorative",
                    "u": 1
                  },
                  {
                    "w": "mythical",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "mountains-3autumn2",
            "title": "Mountains",
            "chapters": [
              {
                "n": 1,
                "title": "What is a mountain?",
                "words": [
                  {
                    "w": "mountainous regions",
                    "u": 1
                  },
                  {
                    "w": "mountains",
                    "u": 1
                  },
                  {
                    "w": "hill",
                    "u": 1
                  },
                  {
                    "w": "Ben Nevis",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Mountain ranges",
                "words": [
                  {
                    "w": "summit",
                    "u": 1
                  },
                  {
                    "w": "terraces",
                    "u": 2
                  },
                  {
                    "w": "slopes",
                    "u": 1
                  },
                  {
                    "w": "peak",
                    "u": 2
                  },
                  {
                    "w": "Mount Everest",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Why do people live",
                "words": [
                  {
                    "w": "Alps",
                    "u": 2
                  },
                  {
                    "w": "Andes",
                    "u": 1
                  },
                  {
                    "w": "adapted",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Living in the Andes",
                "words": [
                  {
                    "w": "valleys",
                    "u": 1
                  },
                  {
                    "w": "terraced farming",
                    "u": 1
                  },
                  {
                    "w": "mountain pass",
                    "u": 1
                  },
                  {
                    "w": "Highlands",
                    "u": 1
                  },
                  {
                    "w": "Cairngorms",
                    "u": 1
                  },
                  {
                    "w": "trek",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Mountainous regions",
                "words": [
                  {
                    "w": "Pennines",
                    "u": 1
                  },
                  {
                    "w": "Lake District",
                    "u": 1
                  },
                  {
                    "w": "Yorkshire Dales",
                    "u": 1
                  },
                  {
                    "w": "Brecon Beacons",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Snowdonia",
                "words": [
                  {
                    "w": "above sea level",
                    "u": 1
                  },
                  {
                    "w": "temperature",
                    "u": 2
                  },
                  {
                    "w": "Snowdonia",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "more-hindu-stories-3autumn2",
            "title": "More Hindu stories",
            "chapters": [
              {
                "n": 1,
                "title": "Manu and Matsya the fish",
                "words": [
                  {
                    "w": "reveal",
                    "u": 1
                  },
                  {
                    "w": "boarded",
                    "u": 1
                  },
                  {
                    "w": "holy",
                    "u": 1
                  },
                  {
                    "w": "Manu",
                    "u": 1
                  },
                  {
                    "w": "Matsya",
                    "u": 1
                  },
                  {
                    "w": "Vedas",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The Vedas in danger!",
                "words": [
                  {
                    "w": "precious",
                    "u": 1
                  },
                  {
                    "w": "defeated",
                    "u": 1
                  },
                  {
                    "w": "evil",
                    "u": 1
                  },
                  {
                    "w": "souls",
                    "u": 1
                  },
                  {
                    "w": "journey",
                    "u": 1
                  },
                  {
                    "w": "conch",
                    "u": 1
                  },
                  {
                    "w": "wrestled",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Vishnu and his symbols",
                "words": [
                  {
                    "w": "mind",
                    "u": 1
                  },
                  {
                    "w": "purity",
                    "u": 1
                  },
                  {
                    "w": "weapon",
                    "u": 1
                  },
                  {
                    "w": "infinity",
                    "u": 1
                  },
                  {
                    "w": "infinite",
                    "u": 1
                  },
                  {
                    "w": "priest",
                    "u": 1
                  },
                  {
                    "w": "charm",
                    "u": 1
                  },
                  {
                    "w": "offered",
                    "u": 1
                  },
                  {
                    "w": "offerings",
                    "u": 1
                  },
                  {
                    "w": "mace",
                    "u": 1
                  },
                  {
                    "w": "lotus",
                    "u": 1
                  },
                  {
                    "w": "chakra",
                    "u": 1
                  },
                  {
                    "w": "chanted",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "A changing religion",
                "words": [
                  {
                    "w": "blessings",
                    "u": 1
                  },
                  {
                    "w": "Sanskrit",
                    "u": 1
                  },
                  {
                    "w": "sacrifices",
                    "u": 2
                  },
                  {
                    "w": "consuming",
                    "u": 1
                  },
                  {
                    "w": "versions",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Arjuna faces the battlefield",
                "words": [
                  {
                    "w": "jealous",
                    "u": 1
                  },
                  {
                    "w": "envy",
                    "u": 2
                  },
                  {
                    "w": "exile",
                    "u": 4
                  },
                  {
                    "w": "battlefield",
                    "u": 2
                  },
                  {
                    "w": "Krishna",
                    "u": 1
                  },
                  {
                    "w": "archer",
                    "u": 1
                  },
                  {
                    "w": "charioteer",
                    "u": 1
                  },
                  {
                    "w": "bow and arrow",
                    "u": 1
                  },
                  {
                    "w": "blood raced",
                    "u": 1
                  },
                  {
                    "w": "Mahabharata",
                    "u": 1
                  },
                  {
                    "w": "hero",
                    "u": 1
                  },
                  {
                    "w": "Arjuna",
                    "u": 1
                  },
                  {
                    "w": "royal",
                    "u": 1
                  },
                  {
                    "w": "warriors",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "Arjuna and Krishna have a conversation",
                "words": [
                  {
                    "w": "conversation",
                    "u": 1
                  },
                  {
                    "w": "avatars",
                    "u": 1
                  },
                  {
                    "w": "flute",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "3",
      "term": "Spring1",
      "cols": {
        "History": [
          {
            "id": "indus-valley-3spring1",
            "title": "Indus Valley",
            "chapters": [
              {
                "n": 1,
                "title": "The dancing girl",
                "words": [
                  {
                    "w": "seals",
                    "u": 1
                  },
                  {
                    "w": "Harappa",
                    "u": 1
                  },
                  {
                    "w": "monuments",
                    "u": 1
                  },
                  {
                    "w": "necklace",
                    "u": 2
                  },
                  {
                    "w": "bangles",
                    "u": 1
                  },
                  {
                    "w": "Mohenjo-Daro",
                    "u": 1
                  },
                  {
                    "w": "merchants",
                    "u": 1
                  },
                  {
                    "w": "reconstructed",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "So many puzzles!",
                "words": [
                  {
                    "w": "beckon",
                    "u": 1
                  },
                  {
                    "w": "sources",
                    "u": 1
                  },
                  {
                    "w": "evidence",
                    "u": 1
                  },
                  {
                    "w": "trench",
                    "u": 1
                  },
                  {
                    "w": "pottery",
                    "u": 1
                  },
                  {
                    "w": "potsherds",
                    "u": 1
                  },
                  {
                    "w": "threshed",
                    "u": 1
                  },
                  {
                    "w": "Threshing",
                    "u": 1
                  },
                  {
                    "w": "barley",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Bricks, buildings, baths and bathrooms",
                "words": [
                  {
                    "w": "wells",
                    "u": 1
                  },
                  {
                    "w": "citadel",
                    "u": 1
                  },
                  {
                    "w": "fired",
                    "u": 1
                  },
                  {
                    "w": "kiln",
                    "u": 1
                  },
                  {
                    "w": "technology",
                    "u": 1
                  },
                  {
                    "w": "sewage",
                    "u": 1
                  },
                  {
                    "w": "Lothal",
                    "u": 1
                  },
                  {
                    "w": "drain",
                    "u": 1
                  },
                  {
                    "w": "draw water",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Making beautiful things",
                "words": [
                  {
                    "w": "ornaments",
                    "u": 1
                  },
                  {
                    "w": "jewellery",
                    "u": 1
                  },
                  {
                    "w": "oxen",
                    "u": 2
                  },
                  {
                    "w": "rhinoceroses",
                    "u": 1
                  },
                  {
                    "w": "unicorns",
                    "u": 1
                  },
                  {
                    "w": "terracotta",
                    "u": 1
                  },
                  {
                    "w": "carnelian",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Boats and barter, trade and travel",
                "words": [
                  {
                    "w": "weights",
                    "u": 1
                  },
                  {
                    "w": "trade route",
                    "u": 1
                  },
                  {
                    "w": "prow",
                    "u": 1
                  },
                  {
                    "w": "transport",
                    "u": 1
                  },
                  {
                    "w": "barter",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Two more puzzles: \u000b    rulers and religion",
                "words": [
                  {
                    "w": "Hindu",
                    "u": 1
                  },
                  {
                    "w": "granary",
                    "u": 1
                  },
                  {
                    "w": "figurines",
                    "u": 1
                  },
                  {
                    "w": "fertility",
                    "u": 1
                  },
                  {
                    "w": "robe",
                    "u": 1
                  },
                  {
                    "w": "governments",
                    "u": 1
                  },
                  {
                    "w": "governed",
                    "u": 1
                  },
                  {
                    "w": "Asia",
                    "u": 1
                  },
                  {
                    "w": "Asian",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "settlements-3spring1",
            "title": "Settlements",
            "chapters": [
              {
                "n": 1,
                "title": "What is a settlement?",
                "words": [
                  {
                    "w": "city",
                    "u": 1
                  },
                  {
                    "w": "village",
                    "u": 1
                  },
                  {
                    "w": "inhabitants",
                    "u": 1
                  },
                  {
                    "w": "rural",
                    "u": 2
                  },
                  {
                    "w": "farmstead",
                    "u": 1
                  },
                  {
                    "w": "hamlet",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "What is a village?",
                "words": [
                  {
                    "w": "primary school",
                    "u": 1
                  },
                  {
                    "w": "pub",
                    "u": 1
                  },
                  {
                    "w": "village hall",
                    "u": 1
                  },
                  {
                    "w": "church",
                    "u": 1
                  },
                  {
                    "w": "village green",
                    "u": 1
                  },
                  {
                    "w": "post office",
                    "u": 1
                  },
                  {
                    "w": "small shops",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "What is a town?",
                "words": [
                  {
                    "w": "coastal town",
                    "u": 1
                  },
                  {
                    "w": "city",
                    "u": 1
                  },
                  {
                    "w": "facilities",
                    "u": 1
                  },
                  {
                    "w": "settlement",
                    "u": 1
                  },
                  {
                    "w": "adapt",
                    "u": 1
                  },
                  {
                    "w": "secondary school",
                    "u": 1
                  },
                  {
                    "w": "railway station",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "What is a city?",
                "words": [
                  {
                    "w": "airport",
                    "u": 1
                  },
                  {
                    "w": "cathedral",
                    "u": 3
                  },
                  {
                    "w": "large hospitals",
                    "u": 1
                  },
                  {
                    "w": "university",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "London:",
                "words": [
                  {
                    "w": "sprawling",
                    "u": 1
                  },
                  {
                    "w": "cycle lanes",
                    "u": 1
                  },
                  {
                    "w": "flats",
                    "u": 1
                  },
                  {
                    "w": "conurbation",
                    "u": 1
                  },
                  {
                    "w": "Tube",
                    "u": 1
                  },
                  {
                    "w": "Underground",
                    "u": 1
                  },
                  {
                    "w": "Londoners",
                    "u": 1
                  },
                  {
                    "w": "boroughs",
                    "u": 1
                  },
                  {
                    "w": "urban sprawl",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Cardiff is a city",
                "words": [
                  {
                    "w": "businesses",
                    "u": 1
                  },
                  {
                    "w": "connect",
                    "u": 1
                  },
                  {
                    "w": "Cardiff",
                    "u": 1
                  },
                  {
                    "w": "capital city",
                    "u": 2
                  },
                  {
                    "w": "Taff",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Cardiff is a city\t\t\t\t\tPage 30",
                "words": [
                  {
                    "w": "settlements",
                    "u": 1
                  },
                  {
                    "w": "settlement",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "living-hindu-traditions-3spring1",
            "title": "Living Hindu Traditions",
            "chapters": [
              {
                "n": 1,
                "title": "Worshipping together – family puja",
                "words": [
                  {
                    "w": "shrine",
                    "u": 1
                  },
                  {
                    "w": "puja",
                    "u": 1
                  },
                  {
                    "w": "puja tray",
                    "u": 1
                  },
                  {
                    "w": "sandalwood",
                    "u": 1
                  },
                  {
                    "w": "incense",
                    "u": 2
                  },
                  {
                    "w": "atmosphere",
                    "u": 2
                  },
                  {
                    "w": "impure",
                    "u": 1
                  },
                  {
                    "w": "Ganesha",
                    "u": 1
                  },
                  {
                    "w": "swirl",
                    "u": 1
                  },
                  {
                    "w": "aarti",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Worshipping anywhere, any time!",
                "words": [
                  {
                    "w": "supreme",
                    "u": 1
                  },
                  {
                    "w": "contentment",
                    "u": 1
                  },
                  {
                    "w": "creation",
                    "u": 1
                  },
                  {
                    "w": "murti",
                    "u": 1
                  },
                  {
                    "w": "tradition",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Ganesha, the god of good fortune",
                "words": [
                  {
                    "w": "wisdom",
                    "u": 2
                  },
                  {
                    "w": "wise",
                    "u": 1
                  },
                  {
                    "w": "truth",
                    "u": 1
                  },
                  {
                    "w": "prayer",
                    "u": 2
                  },
                  {
                    "w": "joy",
                    "u": 1
                  },
                  {
                    "w": "good fortune",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The story of Ganesha’s birth",
                "words": [
                  {
                    "w": "Parvati",
                    "u": 1
                  },
                  {
                    "w": "threatened",
                    "u": 1
                  },
                  {
                    "w": "guard",
                    "u": 1
                  },
                  {
                    "w": "warlike",
                    "u": 1
                  },
                  {
                    "w": "fierce",
                    "u": 1
                  },
                  {
                    "w": "Shiva",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Shiva: endings and beginnings",
                "words": [
                  {
                    "w": "hustle and bustle",
                    "u": 1
                  },
                  {
                    "w": "focus",
                    "u": 2
                  },
                  {
                    "w": "trident",
                    "u": 2
                  },
                  {
                    "w": "timeless",
                    "u": 1
                  },
                  {
                    "w": "necklace",
                    "u": 2
                  },
                  {
                    "w": "renewal",
                    "u": 1
                  },
                  {
                    "w": "meditating",
                    "u": 1
                  },
                  {
                    "w": "shed",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "A festival for Parvati!",
                "words": [
                  {
                    "w": "Nepal",
                    "u": 1
                  },
                  {
                    "w": "traditional",
                    "u": 1
                  },
                  {
                    "w": "henna",
                    "u": 1
                  },
                  {
                    "w": "Teej",
                    "u": 1
                  },
                  {
                    "w": "fasting",
                    "u": 1
                  },
                  {
                    "w": "processions",
                    "u": 1
                  },
                  {
                    "w": "thankful",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "3",
      "term": "Spring2",
      "cols": {
        "History": [
          {
            "id": "persia-and-greece-3spring2",
            "title": "Persia and Greece",
            "chapters": [
              {
                "n": 1,
                "title": "The king of kings",
                "words": [
                  {
                    "w": "Persian Empire",
                    "u": 1
                  },
                  {
                    "w": "Cyrus",
                    "u": 1
                  },
                  {
                    "w": "Darius",
                    "u": 1
                  },
                  {
                    "w": "empire",
                    "u": 1
                  },
                  {
                    "w": "Babylon",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The Persian Empire",
                "words": [
                  {
                    "w": "succeeded",
                    "u": 1
                  },
                  {
                    "w": "slaves",
                    "u": 1
                  },
                  {
                    "w": "satrapy",
                    "u": 1
                  },
                  {
                    "w": "satrap",
                    "u": 1
                  },
                  {
                    "w": "taxes",
                    "u": 2
                  },
                  {
                    "w": "tax",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The Greek city-states",
                "words": [
                  {
                    "w": "theatre",
                    "u": 2
                  },
                  {
                    "w": "city-states",
                    "u": 1
                  },
                  {
                    "w": "agora",
                    "u": 1
                  },
                  {
                    "w": "polis",
                    "u": 1
                  },
                  {
                    "w": "acropolis",
                    "u": 1
                  },
                  {
                    "w": "temple",
                    "u": 3
                  },
                  {
                    "w": "gymnasium",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Greek gods and goddesses",
                "words": [
                  {
                    "w": "Hera",
                    "u": 1
                  },
                  {
                    "w": "Poseidon",
                    "u": 1
                  },
                  {
                    "w": "Olympus",
                    "u": 1
                  },
                  {
                    "w": "Ares",
                    "u": 1
                  },
                  {
                    "w": "Zeus",
                    "u": 1
                  },
                  {
                    "w": "displeased",
                    "u": 1
                  },
                  {
                    "w": "shrines",
                    "u": 2
                  },
                  {
                    "w": "trident",
                    "u": 2
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Greek language",
                "words": [
                  {
                    "w": "beta",
                    "u": 1
                  },
                  {
                    "w": "alphabet",
                    "u": 1
                  },
                  {
                    "w": "alpha",
                    "u": 1
                  },
                  {
                    "w": "Homer",
                    "u": 2
                  },
                  {
                    "w": "Iliad",
                    "u": 1
                  },
                  {
                    "w": "Achilles",
                    "u": 1
                  },
                  {
                    "w": "besiege",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The Greek and Persian Wars",
                "words": [
                  {
                    "w": "strait",
                    "u": 2
                  },
                  {
                    "w": "pass",
                    "u": 1
                  },
                  {
                    "w": "Marathon",
                    "u": 1
                  },
                  {
                    "w": "surrendered",
                    "u": 3
                  },
                  {
                    "w": "messengers",
                    "u": 1
                  },
                  {
                    "w": "surrender",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "agriculture-3spring2",
            "title": "Agriculture",
            "chapters": [
              {
                "n": 1,
                "title": "What is agriculture?",
                "words": [
                  {
                    "w": "distributed",
                    "u": 1
                  },
                  {
                    "w": "processed",
                    "u": 1
                  },
                  {
                    "w": "arable farming",
                    "u": 1
                  },
                  {
                    "w": "mixed farming",
                    "u": 1
                  },
                  {
                    "w": "agriculture",
                    "u": 1
                  },
                  {
                    "w": "pastoral farming",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Arable farming",
                "words": [
                  {
                    "w": "harvest",
                    "u": 1
                  },
                  {
                    "w": "ripen",
                    "u": 1
                  },
                  {
                    "w": "plough",
                    "u": 1
                  },
                  {
                    "w": "growing season",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Pastoral farming",
                "words": [
                  {
                    "w": "grazing",
                    "u": 1
                  },
                  {
                    "w": "graze",
                    "u": 1
                  },
                  {
                    "w": "manure",
                    "u": 1
                  },
                  {
                    "w": "dairy farmers",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "How does farming change the landscape?",
                "words": [
                  {
                    "w": "forests",
                    "u": 1
                  },
                  {
                    "w": "marshlands",
                    "u": 1
                  },
                  {
                    "w": "hedges",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "How does our food affect farming?",
                "words": [
                  {
                    "w": "Local food",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "How does the food",
                "words": [
                  {
                    "w": "yield",
                    "u": 1
                  },
                  {
                    "w": "fertilisers",
                    "u": 1
                  },
                  {
                    "w": "vegans",
                    "u": 1
                  },
                  {
                    "w": "vegetarian",
                    "u": 1
                  },
                  {
                    "w": "seasonal food",
                    "u": 1
                  },
                  {
                    "w": "organic food",
                    "u": 1
                  },
                  {
                    "w": "pesticides",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Sheep farming in Wales",
                "words": [
                  {
                    "w": "flocks",
                    "u": 1
                  },
                  {
                    "w": "shorn",
                    "u": 1
                  },
                  {
                    "w": "wool",
                    "u": 1
                  },
                  {
                    "w": "Sheepdogs",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "judaism-stories-1-3spring2",
            "title": "Judaism Stories 1",
            "chapters": [
              {
                "n": 1,
                "title": "The Hebrew Bible",
                "words": [
                  {
                    "w": "Jewish",
                    "u": 1
                  },
                  {
                    "w": "Hebrew Bible",
                    "u": 1
                  },
                  {
                    "w": "Abraham",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The story of \u000bAbram and Sarai",
                "words": [
                  {
                    "w": "famine",
                    "u": 1
                  },
                  {
                    "w": "deceived",
                    "u": 1
                  },
                  {
                    "w": "inheritance",
                    "u": 2
                  },
                  {
                    "w": "Promised Land",
                    "u": 1
                  },
                  {
                    "w": "Abram",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "God changes Abram’s name",
                "words": [
                  {
                    "w": "covenant",
                    "u": 1
                  },
                  {
                    "w": "angels",
                    "u": 1
                  },
                  {
                    "w": "Isaac",
                    "u": 1
                  },
                  {
                    "w": "Sarah",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Abraham \u000band his son, Isaac",
                "words": [
                  {
                    "w": "ram",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Isaac and Rebekah",
                "words": [
                  {
                    "w": "Jacob",
                    "u": 1
                  },
                  {
                    "w": "comforted",
                    "u": 1
                  },
                  {
                    "w": "draw water",
                    "u": 2
                  },
                  {
                    "w": "dependable",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The story of \u000bJacob and Rachel",
                "words": [
                  {
                    "w": "birthright",
                    "u": 1
                  },
                  {
                    "w": "Esau",
                    "u": 1
                  },
                  {
                    "w": "inherit",
                    "u": 1
                  },
                  {
                    "w": "ladder",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "3",
      "term": "Summer1",
      "cols": {
        "History": [
          {
            "id": "ancient-greece-3summer1",
            "title": "Ancient Greece",
            "chapters": [
              {
                "n": 1,
                "title": "Athens tries something different",
                "words": [
                  {
                    "w": "democracy",
                    "u": 1
                  },
                  {
                    "w": "voted",
                    "u": 1
                  },
                  {
                    "w": "citizens",
                    "u": 1
                  },
                  {
                    "w": "assembly",
                    "u": 1
                  },
                  {
                    "w": "Pericles",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The Peloponnesian War",
                "words": [
                  {
                    "w": "enslaved",
                    "u": 3
                  },
                  {
                    "w": "Golden Age",
                    "u": 1
                  },
                  {
                    "w": "declared war",
                    "u": 1
                  },
                  {
                    "w": "Peloponnesian War",
                    "u": 1
                  },
                  {
                    "w": "starve",
                    "u": 1
                  },
                  {
                    "w": "plague",
                    "u": 1
                  },
                  {
                    "w": "allies",
                    "u": 1
                  },
                  {
                    "w": "surrendered",
                    "u": 3
                  }
                ]
              },
              {
                "n": 3,
                "title": "The Parthenon",
                "words": [
                  {
                    "w": "pediment",
                    "u": 1
                  },
                  {
                    "w": "sculptures",
                    "u": 2
                  },
                  {
                    "w": "Parthenon",
                    "u": 1
                  },
                  {
                    "w": "architecture",
                    "u": 1
                  },
                  {
                    "w": "architects",
                    "u": 1
                  },
                  {
                    "w": "inspired",
                    "u": 3
                  },
                  {
                    "w": "columns",
                    "u": 1
                  },
                  {
                    "w": "friezes",
                    "u": 1
                  },
                  {
                    "w": "frieze",
                    "u": 1
                  },
                  {
                    "w": "scrolls",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Greek literature",
                "words": [
                  {
                    "w": "Homer",
                    "u": 2
                  },
                  {
                    "w": "chorus",
                    "u": 1
                  },
                  {
                    "w": "literature",
                    "u": 1
                  },
                  {
                    "w": "Sophocles",
                    "u": 1
                  },
                  {
                    "w": "gestures",
                    "u": 1
                  },
                  {
                    "w": "satire",
                    "u": 1
                  },
                  {
                    "w": "comedy",
                    "u": 1
                  },
                  {
                    "w": "tragedy",
                    "u": 2
                  },
                  {
                    "w": "masks",
                    "u": 1
                  },
                  {
                    "w": "playwrights",
                    "u": 1
                  },
                  {
                    "w": "spectators",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Odyssey",
                "words": [
                  {
                    "w": "nymph",
                    "u": 1
                  },
                  {
                    "w": "mast",
                    "u": 2
                  },
                  {
                    "w": "sailors",
                    "u": 1
                  },
                  {
                    "w": "Sirens",
                    "u": 1
                  },
                  {
                    "w": "Cyclops",
                    "u": 1
                  },
                  {
                    "w": "revealed",
                    "u": 1
                  },
                  {
                    "w": "off course",
                    "u": 1
                  },
                  {
                    "w": "Odysseus",
                    "u": 1
                  },
                  {
                    "w": "Odyssey",
                    "u": 1
                  },
                  {
                    "w": "disguised",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The Greeks loved philosophy",
                "words": [
                  {
                    "w": "philosophy",
                    "u": 1
                  },
                  {
                    "w": "Wisdom",
                    "u": 2
                  },
                  {
                    "w": "Academy",
                    "u": 1
                  },
                  {
                    "w": "Plato",
                    "u": 1
                  },
                  {
                    "w": "Socrates",
                    "u": 1
                  },
                  {
                    "w": "philosophers",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "volcanoes-3summer1",
            "title": "Volcanoes",
            "chapters": [
              {
                "n": 1,
                "title": "The journey that no one will make",
                "words": [
                  {
                    "w": "continental crust",
                    "u": 1
                  },
                  {
                    "w": "oceanic crust",
                    "u": 1
                  },
                  {
                    "w": "surface",
                    "u": 1
                  },
                  {
                    "w": "mantle",
                    "u": 1
                  },
                  {
                    "w": "crust",
                    "u": 1
                  },
                  {
                    "w": "planet",
                    "u": 1
                  },
                  {
                    "w": "core",
                    "u": 1
                  },
                  {
                    "w": "scientists",
                    "u": 1
                  },
                  {
                    "w": "iron",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "What happens when a volcano erupts?",
                "words": [
                  {
                    "w": "lava",
                    "u": 1
                  },
                  {
                    "w": "molten",
                    "u": 1
                  },
                  {
                    "w": "Pressure",
                    "u": 1
                  },
                  {
                    "w": "explosive",
                    "u": 1
                  },
                  {
                    "w": "viscous",
                    "u": 1
                  },
                  {
                    "w": "magma",
                    "u": 1
                  },
                  {
                    "w": "volcano",
                    "u": 1
                  },
                  {
                    "w": "shield",
                    "u": 1
                  },
                  {
                    "w": "melted",
                    "u": 1
                  },
                  {
                    "w": "composite",
                    "u": 1
                  },
                  {
                    "w": "Mount Etna",
                    "u": 1
                  },
                  {
                    "w": "supervolcano",
                    "u": 1
                  },
                  {
                    "w": "magma chamber",
                    "u": 1
                  },
                  {
                    "w": "vent",
                    "u": 1
                  },
                  {
                    "w": "erupting",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "How are volcanoes formed?",
                "words": [
                  {
                    "w": "secondary vents",
                    "u": 1
                  },
                  {
                    "w": "volcanic bombs",
                    "u": 1
                  },
                  {
                    "w": "solidify",
                    "u": 1
                  },
                  {
                    "w": "crater",
                    "u": 1
                  },
                  {
                    "w": "Mount Bromo",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Active, dormant and extinct volcanoes",
                "words": [
                  {
                    "w": "Dormant",
                    "u": 1
                  },
                  {
                    "w": "clog",
                    "u": 1
                  },
                  {
                    "w": "active volcano",
                    "u": 1
                  },
                  {
                    "w": "Extinct",
                    "u": 2
                  },
                  {
                    "w": "flow",
                    "u": 1
                  },
                  {
                    "w": "Lava flows",
                    "u": 1
                  },
                  {
                    "w": "Mudflows",
                    "u": 1
                  },
                  {
                    "w": "Pyroclastic flows",
                    "u": 1
                  },
                  {
                    "w": "smother",
                    "u": 1
                  },
                  {
                    "w": "disrupt",
                    "u": 1
                  },
                  {
                    "w": "plumes",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Mount Etna",
                "words": [
                  {
                    "w": "destructive",
                    "u": 1
                  },
                  {
                    "w": "Sicily",
                    "u": 1
                  },
                  {
                    "w": "endangered",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Why do people choose to be near a dangerous volcano?",
                "words": [
                  {
                    "w": "evacuated",
                    "u": 2
                  },
                  {
                    "w": "enrich",
                    "u": 1
                  },
                  {
                    "w": "geologist",
                    "u": 1
                  },
                  {
                    "w": "citrus fruits",
                    "u": 1
                  },
                  {
                    "w": "explosives",
                    "u": 1
                  },
                  {
                    "w": "divert",
                    "u": 2
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "joseph,-moses-and-the-exodus-3summer1",
            "title": "Joseph, Moses and the Exodus",
            "chapters": [
              {
                "n": 1,
                "title": "Joseph and his coat of many colours",
                "words": [
                  {
                    "w": "mauled",
                    "u": 1
                  },
                  {
                    "w": "interpret",
                    "u": 1
                  },
                  {
                    "w": "plenty",
                    "u": 1
                  },
                  {
                    "w": "coat of many colours",
                    "u": 1
                  },
                  {
                    "w": "overseer",
                    "u": 1
                  },
                  {
                    "w": "guilty",
                    "u": 1
                  },
                  {
                    "w": "dream",
                    "u": 1
                  },
                  {
                    "w": "envy",
                    "u": 2
                  },
                  {
                    "w": "descended",
                    "u": 3
                  },
                  {
                    "w": "Joseph",
                    "u": 2
                  },
                  {
                    "w": "grieved",
                    "u": 1
                  },
                  {
                    "w": "servant",
                    "u": 1
                  },
                  {
                    "w": "enslaved",
                    "u": 3
                  }
                ]
              },
              {
                "n": 2,
                "title": "Slaves in Egypt",
                "words": [
                  {
                    "w": "extraordinary",
                    "u": 1
                  },
                  {
                    "w": "Israelites",
                    "u": 1
                  },
                  {
                    "w": "outnumber",
                    "u": 1
                  },
                  {
                    "w": "twelve tribes of Israel",
                    "u": 1
                  },
                  {
                    "w": "enslave",
                    "u": 1
                  },
                  {
                    "w": "whipped",
                    "u": 1
                  },
                  {
                    "w": "mortar",
                    "u": 1
                  },
                  {
                    "w": "adrift",
                    "u": 1
                  },
                  {
                    "w": "bulrushes",
                    "u": 1
                  },
                  {
                    "w": "princess",
                    "u": 1
                  },
                  {
                    "w": "gurgling",
                    "u": 1
                  },
                  {
                    "w": "Moses",
                    "u": 1
                  },
                  {
                    "w": "struck",
                    "u": 1
                  },
                  {
                    "w": "exile",
                    "u": 4
                  },
                  {
                    "w": "herding",
                    "u": 2
                  },
                  {
                    "w": "forty years",
                    "u": 1
                  },
                  {
                    "w": "burning bush",
                    "u": 1
                  },
                  {
                    "w": "deliver",
                    "u": 1
                  },
                  {
                    "w": "delivered",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "“Let my people go!”",
                "words": [
                  {
                    "w": "slither",
                    "u": 1
                  },
                  {
                    "w": "magicians",
                    "u": 1
                  },
                  {
                    "w": "confident",
                    "u": 1
                  },
                  {
                    "w": "heart was hard",
                    "u": 1
                  },
                  {
                    "w": "plagues",
                    "u": 1
                  },
                  {
                    "w": "stammer",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The last night in Egypt",
                "words": [
                  {
                    "w": "Passover",
                    "u": 1
                  },
                  {
                    "w": "dawn",
                    "u": 1
                  },
                  {
                    "w": "conversations",
                    "u": 1
                  },
                  {
                    "w": "Exodus",
                    "u": 1
                  },
                  {
                    "w": "deliverer",
                    "u": 1
                  },
                  {
                    "w": "slaughter",
                    "u": 1
                  },
                  {
                    "w": "lintels",
                    "u": 1
                  },
                  {
                    "w": "angel of death",
                    "u": 1
                  },
                  {
                    "w": "firstborn",
                    "u": 1
                  },
                  {
                    "w": "wailing",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The sea, the mountain,",
                "words": [
                  {
                    "w": "sea bed",
                    "u": 1
                  },
                  {
                    "w": "cherubim",
                    "u": 1
                  },
                  {
                    "w": "tabernacle",
                    "u": 1
                  },
                  {
                    "w": "idolatry",
                    "u": 1
                  },
                  {
                    "w": "golden calf",
                    "u": 1
                  },
                  {
                    "w": "ten commandments",
                    "u": 1
                  },
                  {
                    "w": "Ark of the Covenant",
                    "u": 1
                  },
                  {
                    "w": "Red Sea",
                    "u": 2
                  },
                  {
                    "w": "the land flowing with milk and honey",
                    "u": 1
                  },
                  {
                    "w": "hooves",
                    "u": 1
                  },
                  {
                    "w": "pursued",
                    "u": 1
                  },
                  {
                    "w": "reverently",
                    "u": 2
                  },
                  {
                    "w": "Mount Sinai",
                    "u": 1
                  },
                  {
                    "w": "forty days",
                    "u": 1
                  },
                  {
                    "w": "forty nights",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Why are these stories important for Jews?",
                "words": [
                  {
                    "w": "matzah",
                    "u": 1
                  },
                  {
                    "w": "reclining",
                    "u": 1
                  },
                  {
                    "w": "recline",
                    "u": 1
                  },
                  {
                    "w": "Seder",
                    "u": 1
                  },
                  {
                    "w": "kiddush",
                    "u": 1
                  },
                  {
                    "w": "haggadah",
                    "u": 1
                  },
                  {
                    "w": "Seder plate",
                    "u": 1
                  },
                  {
                    "w": "Hallel",
                    "u": 1
                  },
                  {
                    "w": "bitter herbs",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "3",
      "term": "Summer2",
      "cols": {
        "History": [
          {
            "id": "alexander-the-great-3summer2",
            "title": "Alexander the Great",
            "chapters": [
              {
                "n": 1,
                "title": "Greece and Macedon",
                "words": [
                  {
                    "w": "phalanx",
                    "u": 1
                  },
                  {
                    "w": "hoplite",
                    "u": 1
                  },
                  {
                    "w": "puppet king",
                    "u": 1
                  },
                  {
                    "w": "Macedon",
                    "u": 1
                  },
                  {
                    "w": "Philip of Macedon",
                    "u": 1
                  },
                  {
                    "w": "captured",
                    "u": 1
                  },
                  {
                    "w": "hostage",
                    "u": 1
                  },
                  {
                    "w": "sarissa",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "King Philip \u000bmakes Macedon great",
                "words": [
                  {
                    "w": "prophecy",
                    "u": 1
                  },
                  {
                    "w": "oracle",
                    "u": 1
                  },
                  {
                    "w": "Delphi",
                    "u": 1
                  },
                  {
                    "w": "League of Corinth",
                    "u": 1
                  },
                  {
                    "w": "league",
                    "u": 1
                  },
                  {
                    "w": "prophesy",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Alexander: \u000bfrom boy to king",
                "words": [
                  {
                    "w": "assassinated",
                    "u": 1
                  },
                  {
                    "w": "determined",
                    "u": 1
                  },
                  {
                    "w": "legend",
                    "u": 1
                  },
                  {
                    "w": "Bucephalas",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Alexander’s battles",
                "words": [
                  {
                    "w": "retreated",
                    "u": 1
                  },
                  {
                    "w": "Gaugamela",
                    "u": 1
                  },
                  {
                    "w": "lexandria",
                    "u": 1
                  },
                  {
                    "w": "Issus",
                    "u": 1
                  },
                  {
                    "w": "loyalty",
                    "u": 1
                  },
                  {
                    "w": "pledged",
                    "u": 1
                  },
                  {
                    "w": "chariots",
                    "u": 2
                  }
                ]
              },
              {
                "n": 5,
                "title": "Alexander conquers Persia",
                "words": [
                  {
                    "w": "victor",
                    "u": 1
                  },
                  {
                    "w": "divine",
                    "u": 1
                  },
                  {
                    "w": "flew into a rage",
                    "u": 1
                  },
                  {
                    "w": "Ptolemy",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The wonderful library",
                "words": [
                  {
                    "w": "scrolls",
                    "u": 2
                  },
                  {
                    "w": "Galen",
                    "u": 1
                  },
                  {
                    "w": "Euclid",
                    "u": 1
                  },
                  {
                    "w": "geometry",
                    "u": 1
                  },
                  {
                    "w": "astronomy",
                    "u": 1
                  },
                  {
                    "w": "astronomer",
                    "u": 1
                  },
                  {
                    "w": "founded",
                    "u": 1
                  },
                  {
                    "w": "Alexandria",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "climate-and-biomes-3summer2",
            "title": "Climate and Biomes",
            "chapters": [
              {
                "n": 1,
                "title": "The continent of Europe",
                "words": [
                  {
                    "w": "continent",
                    "u": 1
                  },
                  {
                    "w": "oceans",
                    "u": 1
                  },
                  {
                    "w": "Europe",
                    "u": 1
                  },
                  {
                    "w": "Mediterranean Sea",
                    "u": 2
                  },
                  {
                    "w": "Atlantic Ocean",
                    "u": 2
                  },
                  {
                    "w": "Arctic Ocean",
                    "u": 1
                  },
                  {
                    "w": "landlocked",
                    "u": 1
                  },
                  {
                    "w": "weather",
                    "u": 1
                  },
                  {
                    "w": "climate",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Climate zones",
                "words": [
                  {
                    "w": "Equator",
                    "u": 1
                  },
                  {
                    "w": "latitude",
                    "u": 1
                  },
                  {
                    "w": "tropical",
                    "u": 1
                  },
                  {
                    "w": "polar",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Climate and oceans",
                "words": [
                  {
                    "w": "Atlantic Ocean",
                    "u": 2
                  },
                  {
                    "w": "Gulf Stream",
                    "u": 1
                  },
                  {
                    "w": "currents",
                    "u": 1
                  },
                  {
                    "w": "mild",
                    "u": 1
                  },
                  {
                    "w": "ocean",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Climates and biomes",
                "words": [
                  {
                    "w": "savanna",
                    "u": 1
                  },
                  {
                    "w": "tundra",
                    "u": 1
                  },
                  {
                    "w": "biomes",
                    "u": 1
                  },
                  {
                    "w": "rainforest",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Mediterranean climate",
                "words": [
                  {
                    "w": "Mediterranean climate",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The temperate climate:",
                "words": [
                  {
                    "w": "temperature",
                    "u": 2
                  },
                  {
                    "w": "seasons",
                    "u": 1
                  },
                  {
                    "w": "climate",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "judaism-3-3summer2",
            "title": "Judaism 3",
            "chapters": [
              {
                "n": 1,
                "title": "The scouts, the serpent            and the wilderness",
                "words": [
                  {
                    "w": "venomous",
                    "u": 1
                  },
                  {
                    "w": "Jordan River",
                    "u": 1
                  },
                  {
                    "w": "generation",
                    "u": 1
                  },
                  {
                    "w": "bronze serpent",
                    "u": 1
                  },
                  {
                    "w": "doubted",
                    "u": 1
                  },
                  {
                    "w": "grumble",
                    "u": 1
                  },
                  {
                    "w": "report",
                    "u": 1
                  },
                  {
                    "w": "scout",
                    "u": 1
                  },
                  {
                    "w": "flowed with milk and honey",
                    "u": 1
                  },
                  {
                    "w": "fortified",
                    "u": 2
                  },
                  {
                    "w": "scouts",
                    "u": 1
                  },
                  {
                    "w": "high priest",
                    "u": 1
                  },
                  {
                    "w": "Sabbath",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "The scouts, the serpent and the wilderness",
                "words": [
                  {
                    "w": "blessing",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The law, the walls, the judges and a king",
                "words": [
                  {
                    "w": "Levi",
                    "u": 1
                  },
                  {
                    "w": "courageous",
                    "u": 1
                  },
                  {
                    "w": "prosperous",
                    "u": 3
                  },
                  {
                    "w": "spies",
                    "u": 1
                  },
                  {
                    "w": "Jericho",
                    "u": 1
                  },
                  {
                    "w": "spare",
                    "u": 2
                  },
                  {
                    "w": "faithful",
                    "u": 1
                  },
                  {
                    "w": "judges",
                    "u": 1
                  },
                  {
                    "w": "faith",
                    "u": 2
                  },
                  {
                    "w": "Samuel",
                    "u": 1
                  },
                  {
                    "w": "prophet",
                    "u": 2
                  },
                  {
                    "w": "Saul",
                    "u": 1
                  },
                  {
                    "w": "Torah",
                    "u": 1
                  },
                  {
                    "w": "anointed",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Two kings: Saul and David",
                "words": [
                  {
                    "w": "David",
                    "u": 1
                  },
                  {
                    "w": "plundered",
                    "u": 1
                  },
                  {
                    "w": "plunder",
                    "u": 1
                  },
                  {
                    "w": "disobedient",
                    "u": 1
                  },
                  {
                    "w": "Goliath",
                    "u": 1
                  },
                  {
                    "w": "giant",
                    "u": 1
                  },
                  {
                    "w": "insults",
                    "u": 1
                  },
                  {
                    "w": "sling",
                    "u": 1
                  },
                  {
                    "w": "prevailed",
                    "u": 1
                  },
                  {
                    "w": "Jerusalem",
                    "u": 1
                  },
                  {
                    "w": "consulted",
                    "u": 1
                  },
                  {
                    "w": "Philistines",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "King Solomon",
                "words": [
                  {
                    "w": "newborn",
                    "u": 1
                  },
                  {
                    "w": "temple",
                    "u": 3
                  },
                  {
                    "w": "suitably",
                    "u": 1
                  },
                  {
                    "w": "mount",
                    "u": 1
                  },
                  {
                    "w": "Stonecutters",
                    "u": 1
                  },
                  {
                    "w": "atone",
                    "u": 1
                  },
                  {
                    "w": "Atonement",
                    "u": 1
                  },
                  {
                    "w": "Yom Kippur",
                    "u": 1
                  },
                  {
                    "w": "Judah",
                    "u": 1
                  },
                  {
                    "w": "alliance",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "King Solomon builds the Temple in Jerusalem",
                "words": [
                  {
                    "w": "Most Holy Place",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Captives in Babylon",
                "words": [
                  {
                    "w": "Esther",
                    "u": 1
                  },
                  {
                    "w": "decree",
                    "u": 4
                  },
                  {
                    "w": "gallows",
                    "u": 1
                  },
                  {
                    "w": "fast",
                    "u": 1
                  },
                  {
                    "w": "orphan",
                    "u": 1
                  },
                  {
                    "w": "Haman",
                    "u": 1
                  },
                  {
                    "w": "schemed",
                    "u": 1
                  },
                  {
                    "w": "captivity",
                    "u": 1
                  },
                  {
                    "w": "captives",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "How do Jews worship",
                "words": [
                  {
                    "w": "synagogue",
                    "u": 1
                  },
                  {
                    "w": "Purim",
                    "u": 1
                  },
                  {
                    "w": "Maccabees",
                    "u": 1
                  },
                  {
                    "w": "menorah",
                    "u": 1
                  },
                  {
                    "w": "Hanukkah",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "How do Jews worship without the Temple?",
                "words": [
                  {
                    "w": "Tanakh",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "4",
      "term": "Autumn1",
      "cols": {
        "History": [
          {
            "id": "the-roman-republic-4autumn1",
            "title": "The Roman Republic",
            "chapters": [
              {
                "n": 1,
                "title": "Romulus, the first king of Rome",
                "words": [
                  {
                    "w": "senators",
                    "u": 1
                  },
                  {
                    "w": "unity",
                    "u": 1
                  },
                  {
                    "w": "toga",
                    "u": 1
                  },
                  {
                    "w": "temples",
                    "u": 1
                  },
                  {
                    "w": "cunning",
                    "u": 2
                  },
                  {
                    "w": "Sabine",
                    "u": 1
                  },
                  {
                    "w": "festival",
                    "u": 1
                  },
                  {
                    "w": "signal",
                    "u": 1
                  },
                  {
                    "w": "omen",
                    "u": 1
                  },
                  {
                    "w": "Romulus",
                    "u": 1
                  },
                  {
                    "w": "Remus",
                    "u": 1
                  },
                  {
                    "w": "Tiber",
                    "u": 1
                  },
                  {
                    "w": "shepherd",
                    "u": 1
                  },
                  {
                    "w": "753 BCE",
                    "u": 1
                  },
                  {
                    "w": "Rome",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The Roman Republic",
                "words": [
                  {
                    "w": "religious",
                    "u": 1
                  },
                  {
                    "w": "seven hills",
                    "u": 1
                  },
                  {
                    "w": "Tarquin",
                    "u": 1
                  },
                  {
                    "w": "Tarquin the Proud",
                    "u": 1
                  },
                  {
                    "w": "Brutus",
                    "u": 2
                  },
                  {
                    "w": "senate",
                    "u": 1
                  },
                  {
                    "w": "represent",
                    "u": 1
                  },
                  {
                    "w": "SPQR",
                    "u": 1
                  },
                  {
                    "w": "consuls",
                    "u": 1
                  },
                  {
                    "w": "republic",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Rome versus Carthage",
                "words": [
                  {
                    "w": "Carthaginians",
                    "u": 1
                  },
                  {
                    "w": "peninsula",
                    "u": 3
                  },
                  {
                    "w": "Hannibal",
                    "u": 1
                  },
                  {
                    "w": "Punic Wars",
                    "u": 1
                  },
                  {
                    "w": "surrendered",
                    "u": 3
                  },
                  {
                    "w": "heavy fines",
                    "u": 1
                  },
                  {
                    "w": "Carthage",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Hannibal’s attack \u000bon Rome",
                "words": [
                  {
                    "w": "revenge",
                    "u": 2
                  },
                  {
                    "w": "ambushed",
                    "u": 1
                  },
                  {
                    "w": "were lost",
                    "u": 1
                  },
                  {
                    "w": "battlefield",
                    "u": 2
                  },
                  {
                    "w": "camp",
                    "u": 1
                  },
                  {
                    "w": "cavalry",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Scipio saves Rome",
                "words": [
                  {
                    "w": "Scipio",
                    "u": 1
                  },
                  {
                    "w": "criticised",
                    "u": 1
                  },
                  {
                    "w": "threat",
                    "u": 1
                  },
                  {
                    "w": "Scipio Africanus",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Culture in the \u000bRoman Republic",
                "words": [
                  {
                    "w": "plebeians",
                    "u": 1
                  },
                  {
                    "w": "patrician",
                    "u": 1
                  },
                  {
                    "w": "overrule",
                    "u": 1
                  },
                  {
                    "w": "representatives",
                    "u": 1
                  },
                  {
                    "w": "elect",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "rhine-and-mediterranean-4autumn1",
            "title": "Rhine and Mediterranean",
            "chapters": [
              {
                "n": 1,
                "title": "The River Rhine",
                "words": [
                  {
                    "w": "North Sea",
                    "u": 2
                  },
                  {
                    "w": "Lower Rhine",
                    "u": 1
                  },
                  {
                    "w": "Rhine",
                    "u": 1
                  },
                  {
                    "w": "Alps",
                    "u": 2
                  },
                  {
                    "w": "Upper Rhine",
                    "u": 1
                  },
                  {
                    "w": "Cologne",
                    "u": 1
                  },
                  {
                    "w": "confluence",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Cologne:",
                "words": [
                  {
                    "w": "rainfall",
                    "u": 1
                  },
                  {
                    "w": "bank",
                    "u": 1
                  },
                  {
                    "w": "banks",
                    "u": 1
                  },
                  {
                    "w": "flood walls",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Rotterdam: city at the mouth of the Rhine",
                "words": [
                  {
                    "w": "importing",
                    "u": 1
                  },
                  {
                    "w": "exporting",
                    "u": 1
                  },
                  {
                    "w": "harness",
                    "u": 1
                  },
                  {
                    "w": "port",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The changing Rhine",
                "words": [
                  {
                    "w": "lock",
                    "u": 1
                  },
                  {
                    "w": "drained",
                    "u": 1
                  },
                  {
                    "w": "wetlands",
                    "u": 1
                  },
                  {
                    "w": "the Med",
                    "u": 1
                  },
                  {
                    "w": "strait",
                    "u": 2
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Mediterranean Sea",
                "words": [
                  {
                    "w": "mainland",
                    "u": 2
                  },
                  {
                    "w": "peninsula",
                    "u": 3
                  },
                  {
                    "w": "enclosed sea",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The Suez Canal",
                "words": [
                  {
                    "w": "Suez Canal",
                    "u": 1
                  },
                  {
                    "w": "waterway",
                    "u": 1
                  },
                  {
                    "w": "Red Sea",
                    "u": 2
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "christ-1_family-of-jesus-4autumn1",
            "title": "Christ 1_Family of Jesus",
            "chapters": [
              {
                "n": 0,
                "title": "0",
                "words": [
                  {
                    "w": "the Davidic line",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "Judea in the \u000bfirst century BC",
                "words": [
                  {
                    "w": "anointing",
                    "u": 1
                  },
                  {
                    "w": "Judea",
                    "u": 2
                  },
                  {
                    "w": "Herod",
                    "u": 1
                  },
                  {
                    "w": "pledges",
                    "u": 1
                  },
                  {
                    "w": "Messiah",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The coming of the Messiah",
                "words": [
                  {
                    "w": "foretold",
                    "u": 1
                  },
                  {
                    "w": "the Davidic",
                    "u": 1
                  },
                  {
                    "w": "line",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Mary and Joseph",
                "words": [
                  {
                    "w": "lily",
                    "u": 1
                  },
                  {
                    "w": "Old Testament",
                    "u": 1
                  },
                  {
                    "w": "Gospels",
                    "u": 1
                  },
                  {
                    "w": "engaged",
                    "u": 1
                  },
                  {
                    "w": "Mary",
                    "u": 1
                  },
                  {
                    "w": "New Testament",
                    "u": 2
                  },
                  {
                    "w": "Nazareth",
                    "u": 1
                  },
                  {
                    "w": "Joseph",
                    "u": 2
                  },
                  {
                    "w": "carpenter",
                    "u": 1
                  },
                  {
                    "w": "testament",
                    "u": 2
                  },
                  {
                    "w": "Christ",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "The Annunciation",
                "words": [
                  {
                    "w": "Elizabeth",
                    "u": 1
                  },
                  {
                    "w": "Christmas carol",
                    "u": 1
                  },
                  {
                    "w": "Annunciation",
                    "u": 1
                  },
                  {
                    "w": "announced",
                    "u": 1
                  },
                  {
                    "w": "Gabriel",
                    "u": 1
                  },
                  {
                    "w": "Hail Mary",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Mary visits her",
                "words": [
                  {
                    "w": "humble",
                    "u": 1
                  },
                  {
                    "w": "rejoices",
                    "u": 1
                  },
                  {
                    "w": "rejoicing",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Why are these stories important for Christians?",
                "words": [
                  {
                    "w": "appearance",
                    "u": 1
                  },
                  {
                    "w": "Messiah – the anointed one",
                    "u": 1
                  },
                  {
                    "w": "angelic",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "4",
      "term": "Autumn2",
      "cols": {
        "History": [
          {
            "id": "roman-empire-4autumn2",
            "title": "Roman Empire",
            "chapters": [
              {
                "n": 1,
                "title": "The Roman army",
                "words": [
                  {
                    "w": "survival",
                    "u": 1
                  },
                  {
                    "w": "frontier",
                    "u": 2
                  },
                  {
                    "w": "peninsula",
                    "u": 3
                  },
                  {
                    "w": "province",
                    "u": 2
                  },
                  {
                    "w": "governor",
                    "u": 1
                  },
                  {
                    "w": "legion",
                    "u": 1
                  },
                  {
                    "w": "centurion",
                    "u": 1
                  },
                  {
                    "w": "rebel",
                    "u": 1
                  },
                  {
                    "w": "height",
                    "u": 1
                  },
                  {
                    "w": "at the height of",
                    "u": 1
                  },
                  {
                    "w": "standard",
                    "u": 1
                  },
                  {
                    "w": "forts",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Julius Caesar",
                "words": [
                  {
                    "w": "Julius Caesar",
                    "u": 1
                  },
                  {
                    "w": "Ides of March",
                    "u": 1
                  },
                  {
                    "w": "Brutus",
                    "u": 2
                  },
                  {
                    "w": "foreign",
                    "u": 1
                  },
                  {
                    "w": "Pompey",
                    "u": 1
                  },
                  {
                    "w": "Gaul",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Augustus: the first emperor",
                "words": [
                  {
                    "w": "Mark Antony",
                    "u": 1
                  },
                  {
                    "w": "descended",
                    "u": 3
                  },
                  {
                    "w": "Augustus",
                    "u": 1
                  },
                  {
                    "w": "cunning",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Emperors Claudius and Nero",
                "words": [
                  {
                    "w": "Claudius",
                    "u": 2
                  },
                  {
                    "w": "aqueducts",
                    "u": 1
                  },
                  {
                    "w": "advantage",
                    "u": 2
                  },
                  {
                    "w": "emperor",
                    "u": 1
                  },
                  {
                    "w": "proclaim",
                    "u": 1
                  },
                  {
                    "w": "Colosseum",
                    "u": 1
                  },
                  {
                    "w": "Nero",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Pompeii and the \u000beruption of Vesuvius",
                "words": [
                  {
                    "w": "debris",
                    "u": 1
                  },
                  {
                    "w": "panicked",
                    "u": 1
                  },
                  {
                    "w": "Pompeii",
                    "u": 1
                  },
                  {
                    "w": "Vesuvius",
                    "u": 1
                  },
                  {
                    "w": "Pliny",
                    "u": 1
                  },
                  {
                    "w": "vapour",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The Jewish-Roman War",
                "words": [
                  {
                    "w": "rebellion",
                    "u": 1
                  },
                  {
                    "w": "Judea",
                    "u": 2
                  },
                  {
                    "w": "imperial",
                    "u": 1
                  },
                  {
                    "w": "culminated",
                    "u": 1
                  },
                  {
                    "w": "enslaved",
                    "u": 3
                  },
                  {
                    "w": "trophies",
                    "u": 1
                  },
                  {
                    "w": "Pockets of resistance",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "population-4autumn2",
            "title": "Population",
            "chapters": [
              {
                "n": 1,
                "title": "What is population?",
                "words": [
                  {
                    "w": "densely populated",
                    "u": 1
                  },
                  {
                    "w": "population density",
                    "u": 1
                  },
                  {
                    "w": "population distribution",
                    "u": 1
                  },
                  {
                    "w": "sparsely populated",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Migration",
                "words": [
                  {
                    "w": "rural",
                    "u": 2
                  },
                  {
                    "w": "urban",
                    "u": 1
                  },
                  {
                    "w": "low population density",
                    "u": 1
                  },
                  {
                    "w": "high population density",
                    "u": 1
                  },
                  {
                    "w": "population density",
                    "u": 1
                  },
                  {
                    "w": "WALES",
                    "u": 2
                  },
                  {
                    "w": "migration",
                    "u": 1
                  },
                  {
                    "w": "rural to urban migration",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Multi-ethnic London",
                "words": [
                  {
                    "w": "census",
                    "u": 2
                  },
                  {
                    "w": "ethnically diverse",
                    "u": 1
                  },
                  {
                    "w": "ethnic",
                    "u": 1
                  },
                  {
                    "w": "diverse",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Multi-ethnic Cardiff",
                "words": [
                  {
                    "w": "ethnicity",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Welsh language and culture",
                "words": [
                  {
                    "w": "Eisteddfod",
                    "u": 1
                  },
                  {
                    "w": "Cymraeg",
                    "u": 1
                  },
                  {
                    "w": "Welsh",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "Welsh and British identity",
                "words": [
                  {
                    "w": "floral",
                    "u": 1
                  },
                  {
                    "w": "identity",
                    "u": 2
                  },
                  {
                    "w": "minted",
                    "u": 1
                  },
                  {
                    "w": "Wales",
                    "u": 2
                  },
                  {
                    "w": "British",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Welsh and British identity\t\t\t\tPage 28",
                "words": [
                  {
                    "w": "population",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "birth-of-jesus-4autumn2",
            "title": "Birth of Jesus",
            "chapters": [
              {
                "n": 1,
                "title": "The New Testament introduces Jesus’s birth",
                "words": [
                  {
                    "w": "Christmas",
                    "u": 1
                  },
                  {
                    "w": "testament",
                    "u": 2
                  },
                  {
                    "w": "Holy Bible",
                    "u": 1
                  },
                  {
                    "w": "New Testament",
                    "u": 2
                  },
                  {
                    "w": "Nativity",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The first Christmas:\u000bJesus is born",
                "words": [
                  {
                    "w": "Bethlehem",
                    "u": 2
                  },
                  {
                    "w": "decree",
                    "u": 4
                  },
                  {
                    "w": "Jesus",
                    "u": 1
                  },
                  {
                    "w": "census",
                    "u": 2
                  },
                  {
                    "w": "Virgin Mary",
                    "u": 1
                  },
                  {
                    "w": "manger",
                    "u": 1
                  },
                  {
                    "w": "swaddling",
                    "u": 1
                  },
                  {
                    "w": "inn",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The shepherds visit Jesus",
                "words": [
                  {
                    "w": "pondered",
                    "u": 1
                  },
                  {
                    "w": "shepherds",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The wise men visit Jesus",
                "words": [
                  {
                    "w": "adored",
                    "u": 1
                  },
                  {
                    "w": "wise men from the East",
                    "u": 1
                  },
                  {
                    "w": "myrrh",
                    "u": 2
                  },
                  {
                    "w": "frankincense",
                    "u": 2
                  },
                  {
                    "w": "gold",
                    "u": 1
                  },
                  {
                    "w": "Magi",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Mary and Joseph escape to Egypt",
                "words": [
                  {
                    "w": "Holy Family",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "4",
      "term": "Spring1",
      "cols": {
        "History": [
          {
            "id": "roman-britain-4spring1",
            "title": "Roman Britain",
            "chapters": [
              {
                "n": 1,
                "title": "The Romans        invade Britannia",
                "words": [
                  {
                    "w": "chieftain",
                    "u": 1
                  },
                  {
                    "w": "Claudius",
                    "u": 2
                  },
                  {
                    "w": "invasion",
                    "u": 1
                  },
                  {
                    "w": "Britannia",
                    "u": 1
                  },
                  {
                    "w": "Caratacus",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "The Romans invade Britannia",
                "words": [
                  {
                    "w": "Celtic tribes",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Caratacus fights back",
                "words": [
                  {
                    "w": "warriors",
                    "u": 2
                  },
                  {
                    "w": "forces",
                    "u": 1
                  },
                  {
                    "w": "fort",
                    "u": 1
                  },
                  {
                    "w": "ascend",
                    "u": 1
                  },
                  {
                    "w": "breast-plates",
                    "u": 1
                  },
                  {
                    "w": "defeat",
                    "u": 1
                  },
                  {
                    "w": "placed in chains",
                    "u": 1
                  },
                  {
                    "w": "heavy taxes",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Boudicca’s revolt against the Romans",
                "words": [
                  {
                    "w": "capital city",
                    "u": 2
                  },
                  {
                    "w": "razed to the ground",
                    "u": 1
                  },
                  {
                    "w": "spring",
                    "u": 2
                  },
                  {
                    "w": "Boudicca",
                    "u": 1
                  },
                  {
                    "w": "Iceni",
                    "u": 1
                  },
                  {
                    "w": "revolt",
                    "u": 1
                  },
                  {
                    "w": "stationed",
                    "u": 1
                  },
                  {
                    "w": "Colchester",
                    "u": 1
                  },
                  {
                    "w": "heavily outnumbered",
                    "u": 1
                  },
                  {
                    "w": "Watling Street",
                    "u": 1
                  },
                  {
                    "w": "increased in number",
                    "u": 1
                  },
                  {
                    "w": "without delay",
                    "u": 1
                  },
                  {
                    "w": "showed no mercy",
                    "u": 1
                  },
                  {
                    "w": "Londinium",
                    "u": 1
                  },
                  {
                    "w": "raised an army",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The Roman Town \u000bof Aquae Sulis",
                "words": [
                  {
                    "w": "Aquae Sulis",
                    "u": 1
                  },
                  {
                    "w": "intersecting",
                    "u": 1
                  },
                  {
                    "w": "fortune",
                    "u": 1
                  },
                  {
                    "w": "strigil",
                    "u": 1
                  },
                  {
                    "w": "hypocaust",
                    "u": 1
                  },
                  {
                    "w": "basilica",
                    "u": 1
                  },
                  {
                    "w": "palestra",
                    "u": 1
                  },
                  {
                    "w": "furnaces",
                    "u": 1
                  },
                  {
                    "w": "forum",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The Roman Town of Aquae Sulis",
                "words": [
                  {
                    "w": "theatre",
                    "u": 2
                  },
                  {
                    "w": "temple",
                    "u": 3
                  }
                ]
              },
              {
                "n": 5,
                "title": "Hadrian’s Wall and \u000blife on the frontier",
                "words": [
                  {
                    "w": "approaching",
                    "u": 2
                  },
                  {
                    "w": "Hadrian",
                    "u": 1
                  },
                  {
                    "w": "frontier",
                    "u": 2
                  },
                  {
                    "w": "Vindolanda",
                    "u": 1
                  },
                  {
                    "w": "Hadrian’s Wall",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Hadrian’s Wall and life on the frontier",
                "words": [
                  {
                    "w": "wooden tablets",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Black Romans in Britain",
                "words": [
                  {
                    "w": "garrison",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "coastal-processes-4spring1",
            "title": "Coastal Processes",
            "chapters": [
              {
                "n": 1,
                "title": "Coastal processes",
                "words": [
                  {
                    "w": "transports",
                    "u": 1
                  },
                  {
                    "w": "Harbours",
                    "u": 1
                  },
                  {
                    "w": "Waves",
                    "u": 1
                  },
                  {
                    "w": "transportation",
                    "u": 1
                  },
                  {
                    "w": "coastline",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Other coastal processes",
                "words": [
                  {
                    "w": "landforms",
                    "u": 1
                  },
                  {
                    "w": "bay",
                    "u": 1
                  },
                  {
                    "w": "roynes",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Coastal landforms",
                "words": [
                  {
                    "w": "Cliffs",
                    "u": 1
                  },
                  {
                    "w": "headland",
                    "u": 1
                  },
                  {
                    "w": "shingle",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The Jurassic coast",
                "words": [
                  {
                    "w": "fossils",
                    "u": 1
                  },
                  {
                    "w": "Jurassic Coast",
                    "u": 1
                  },
                  {
                    "w": "preserved",
                    "u": 1
                  },
                  {
                    "w": "cave",
                    "u": 1
                  },
                  {
                    "w": "arch",
                    "u": 1
                  },
                  {
                    "w": "stack",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Coastal habitats: \u000bthe Indian Ocean",
                "words": [
                  {
                    "w": "coral reefs",
                    "u": 1
                  },
                  {
                    "w": "teeming",
                    "u": 1
                  },
                  {
                    "w": "sand dunes",
                    "u": 2
                  },
                  {
                    "w": "Rock pools",
                    "u": 1
                  },
                  {
                    "w": "habitat",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "The coast of west Wales",
                "words": [
                  {
                    "w": "Cardigan Bay",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "christ-3-life-and-teaching-of-jesus-4spring1",
            "title": "Christ 3 Life and Teaching of Jesus",
            "chapters": [
              {
                "n": 1,
                "title": "Jesus is baptised and tempted",
                "words": [
                  {
                    "w": "devil",
                    "u": 1
                  },
                  {
                    "w": "baptised",
                    "u": 2
                  },
                  {
                    "w": "sins",
                    "u": 2
                  },
                  {
                    "w": "childhood",
                    "u": 1
                  },
                  {
                    "w": "Jesus of Nazareth",
                    "u": 1
                  },
                  {
                    "w": "prepare",
                    "u": 1
                  },
                  {
                    "w": "tempt",
                    "u": 1
                  },
                  {
                    "w": "baptism",
                    "u": 1
                  },
                  {
                    "w": "John the Baptist",
                    "u": 1
                  },
                  {
                    "w": "forgiven",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The disciples and the Sermon on the Mount",
                "words": [
                  {
                    "w": "disciples",
                    "u": 1
                  },
                  {
                    "w": "Sea of Galilee",
                    "u": 1
                  },
                  {
                    "w": "an eye for an eye",
                    "u": 1
                  },
                  {
                    "w": "Beatitudes",
                    "u": 1
                  },
                  {
                    "w": "peacemakers",
                    "u": 1
                  },
                  {
                    "w": "mercy",
                    "u": 1
                  },
                  {
                    "w": "sinners",
                    "u": 1
                  },
                  {
                    "w": "Tax collectors",
                    "u": 1
                  },
                  {
                    "w": "Sermon on the Mount",
                    "u": 1
                  },
                  {
                    "w": "authority",
                    "u": 3
                  },
                  {
                    "w": "forgive",
                    "u": 1
                  },
                  {
                    "w": "the Lord’s Prayer",
                    "u": 1
                  },
                  {
                    "w": "love your enemies",
                    "u": 1
                  },
                  {
                    "w": "turn the other cheek",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The miracles of Jesus",
                "words": [
                  {
                    "w": "resurrection",
                    "u": 2
                  },
                  {
                    "w": "Lazarus",
                    "u": 1
                  },
                  {
                    "w": "leprosy",
                    "u": 1
                  },
                  {
                    "w": "paralysed",
                    "u": 1
                  },
                  {
                    "w": "miracles",
                    "u": 2
                  },
                  {
                    "w": "blind",
                    "u": 1
                  },
                  {
                    "w": "faith",
                    "u": 2
                  },
                  {
                    "w": "healed",
                    "u": 1
                  },
                  {
                    "w": "deaf",
                    "u": 1
                  },
                  {
                    "w": "lepers",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The parables of Jesus",
                "words": [
                  {
                    "w": "Samaritan",
                    "u": 1
                  },
                  {
                    "w": "eternal life",
                    "u": 1
                  },
                  {
                    "w": "parables",
                    "u": 1
                  },
                  {
                    "w": "repents",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The transfiguration of Jesus",
                "words": [
                  {
                    "w": "transfigured",
                    "u": 1
                  },
                  {
                    "w": "beloved",
                    "u": 1
                  },
                  {
                    "w": "transfiguration",
                    "u": 1
                  },
                  {
                    "w": "the good shepherd",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Why are these stories important for Christians?",
                "words": [
                  {
                    "w": "sinner",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "4",
      "term": "Spring2",
      "cols": {
        "History": [
          {
            "id": "christianity-in-3-empires-4spring2",
            "title": "Christianity in 3 empires",
            "chapters": [
              {
                "n": 1,
                "title": "To the lions! Christians in the Roman Empire",
                "words": [
                  {
                    "w": "three wise men",
                    "u": 1
                  },
                  {
                    "w": "disloyal",
                    "u": 1
                  },
                  {
                    "w": "suspicious",
                    "u": 1
                  },
                  {
                    "w": "incense",
                    "u": 2
                  },
                  {
                    "w": "myrrh",
                    "u": 2
                  },
                  {
                    "w": "miracles",
                    "u": 2
                  },
                  {
                    "w": "forgiveness",
                    "u": 1
                  },
                  {
                    "w": "Bethlehem",
                    "u": 2
                  },
                  {
                    "w": "rose from the dead",
                    "u": 1
                  },
                  {
                    "w": "frankincense",
                    "u": 2
                  },
                  {
                    "w": "converted",
                    "u": 1
                  },
                  {
                    "w": "baptised",
                    "u": 2
                  },
                  {
                    "w": "sins",
                    "u": 2
                  },
                  {
                    "w": "persecution",
                    "u": 3
                  },
                  {
                    "w": "persecute",
                    "u": 2
                  },
                  {
                    "w": "amphitheatres",
                    "u": 1
                  },
                  {
                    "w": "memorial",
                    "u": 1
                  },
                  {
                    "w": "martyrs",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Emperor Constantine makes big changes",
                "words": [
                  {
                    "w": "vision",
                    "u": 1
                  },
                  {
                    "w": "Byzantine Empire",
                    "u": 1
                  },
                  {
                    "w": "mosaic",
                    "u": 1
                  },
                  {
                    "w": "cultures",
                    "u": 1
                  },
                  {
                    "w": "culture",
                    "u": 2
                  },
                  {
                    "w": "harbour",
                    "u": 2
                  },
                  {
                    "w": "Constantinople",
                    "u": 1
                  },
                  {
                    "w": "Byzantium",
                    "u": 1
                  },
                  {
                    "w": "rivals",
                    "u": 1
                  },
                  {
                    "w": "Constantine",
                    "u": 1
                  },
                  {
                    "w": "official religion",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The Byzantine Empire carries on",
                "words": [
                  {
                    "w": "Visigoths",
                    "u": 1
                  },
                  {
                    "w": "halo",
                    "u": 1
                  },
                  {
                    "w": "baptismal font",
                    "u": 1
                  },
                  {
                    "w": "sacked",
                    "u": 1
                  },
                  {
                    "w": "marble",
                    "u": 1
                  },
                  {
                    "w": "hippodrome",
                    "u": 1
                  },
                  {
                    "w": "stadium",
                    "u": 1
                  },
                  {
                    "w": "Goths",
                    "u": 1
                  },
                  {
                    "w": "Justinian",
                    "u": 1
                  },
                  {
                    "w": "code",
                    "u": 1
                  },
                  {
                    "w": "innocent",
                    "u": 1
                  },
                  {
                    "w": "Law courts",
                    "u": 1
                  },
                  {
                    "w": "rights",
                    "u": 1
                  },
                  {
                    "w": "Empress Theodora",
                    "u": 1
                  },
                  {
                    "w": "Huns",
                    "u": 1
                  },
                  {
                    "w": "court",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "An African empire: Aksum",
                "words": [
                  {
                    "w": "tusks",
                    "u": 1
                  },
                  {
                    "w": "Aksum",
                    "u": 1
                  },
                  {
                    "w": "plateau",
                    "u": 1
                  },
                  {
                    "w": "terraces",
                    "u": 2
                  },
                  {
                    "w": "lowlands",
                    "u": 1
                  },
                  {
                    "w": "Adulis",
                    "u": 1
                  },
                  {
                    "w": "caravan",
                    "u": 1
                  },
                  {
                    "w": "export",
                    "u": 1
                  },
                  {
                    "w": "ivory",
                    "u": 1
                  },
                  {
                    "w": "perfumes",
                    "u": 1
                  },
                  {
                    "w": "Yemen",
                    "u": 1
                  },
                  {
                    "w": "mints",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "A high and holy place",
                "words": [
                  {
                    "w": "perilous",
                    "u": 1
                  },
                  {
                    "w": "rock-hewn",
                    "u": 1
                  },
                  {
                    "w": "Ethiopia",
                    "u": 2
                  },
                  {
                    "w": "state",
                    "u": 2
                  },
                  {
                    "w": "sacred",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "How Aksum became a Christian state",
                "words": [
                  {
                    "w": "Ezana",
                    "u": 1
                  },
                  {
                    "w": "erected",
                    "u": 1
                  },
                  {
                    "w": "stela",
                    "u": 1
                  },
                  {
                    "w": "Professor",
                    "u": 1
                  },
                  {
                    "w": "bishop",
                    "u": 2
                  },
                  {
                    "w": "patriarch",
                    "u": 1
                  },
                  {
                    "w": "shipwreck",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "tourism-4spring2",
            "title": "Tourism",
            "chapters": [
              {
                "n": 1,
                "title": "Oh! I do like to be beside the seaside!",
                "words": [
                  {
                    "w": "paddle",
                    "u": 1
                  },
                  {
                    "w": "Llandudno",
                    "u": 1
                  },
                  {
                    "w": "deckchair",
                    "u": 1
                  },
                  {
                    "w": "sandcastle",
                    "u": 1
                  },
                  {
                    "w": "seaside towns",
                    "u": 1
                  },
                  {
                    "w": "seaside",
                    "u": 1
                  },
                  {
                    "w": "amusements",
                    "u": 1
                  },
                  {
                    "w": "pier",
                    "u": 1
                  },
                  {
                    "w": "Punch and Judy",
                    "u": 1
                  },
                  {
                    "w": "promenade",
                    "u": 1
                  },
                  {
                    "w": "hotels",
                    "u": 1
                  },
                  {
                    "w": "guest houses",
                    "u": 1
                  },
                  {
                    "w": "tourist",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Types of tourism",
                "words": [
                  {
                    "w": "Tourism",
                    "u": 1
                  },
                  {
                    "w": "cultural",
                    "u": 1
                  },
                  {
                    "w": "activity",
                    "u": 1
                  },
                  {
                    "w": "income",
                    "u": 1
                  },
                  {
                    "w": "souvenirs",
                    "u": 1
                  },
                  {
                    "w": "tourist industry",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Mountain adventure",
                "words": [
                  {
                    "w": "advantage",
                    "u": 2
                  },
                  {
                    "w": "environment",
                    "u": 3
                  },
                  {
                    "w": "disadvantages",
                    "u": 1
                  },
                  {
                    "w": "minimum",
                    "u": 1
                  },
                  {
                    "w": "maximum",
                    "u": 1
                  },
                  {
                    "w": "skis",
                    "u": 1
                  },
                  {
                    "w": "ski-lift",
                    "u": 1
                  },
                  {
                    "w": "ski-slope",
                    "u": 1
                  },
                  {
                    "w": "Matterhorn",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Changing tourism",
                "words": [
                  {
                    "w": "destination",
                    "u": 1
                  },
                  {
                    "w": "airlines",
                    "u": 1
                  },
                  {
                    "w": "Airports",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Summer in the sun",
                "words": [
                  {
                    "w": "package holidays",
                    "u": 1
                  },
                  {
                    "w": "sunshine holiday",
                    "u": 1
                  },
                  {
                    "w": "mainland",
                    "u": 2
                  },
                  {
                    "w": "travel agencies",
                    "u": 1
                  },
                  {
                    "w": "air pollution",
                    "u": 1
                  },
                  {
                    "w": "apartments",
                    "u": 1
                  },
                  {
                    "w": "accommodation",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Sustainable tourism",
                "words": [
                  {
                    "w": "coral reef",
                    "u": 1
                  },
                  {
                    "w": "ecotourism",
                    "u": 1
                  },
                  {
                    "w": "Sustainability",
                    "u": 1
                  },
                  {
                    "w": "sustainable",
                    "u": 1
                  },
                  {
                    "w": "economy",
                    "u": 1
                  },
                  {
                    "w": "services",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "death-and-resurrection-of-jesus-4spring2",
            "title": "Death and resurrection of Jesus",
            "chapters": [
              {
                "n": 1,
                "title": "Palm Sunday:                           the entry of Jesus into Jerusalem",
                "words": [
                  {
                    "w": "Gentiles",
                    "u": 1
                  },
                  {
                    "w": "Palm Sunday",
                    "u": 1
                  },
                  {
                    "w": "commemorated",
                    "u": 1
                  },
                  {
                    "w": "courtyard",
                    "u": 1
                  },
                  {
                    "w": "authority",
                    "u": 3
                  }
                ]
              },
              {
                "n": 2,
                "title": "Maundy Thursday: \u000bthe last supper of Jesus",
                "words": [
                  {
                    "w": "denied",
                    "u": 1
                  },
                  {
                    "w": "Judas Iscariot",
                    "u": 1
                  },
                  {
                    "w": "betray",
                    "u": 1
                  },
                  {
                    "w": "Holy Communion",
                    "u": 1
                  },
                  {
                    "w": "convey",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Jesus is arrested,",
                "words": [
                  {
                    "w": "Crucify",
                    "u": 1
                  },
                  {
                    "w": "authorities",
                    "u": 1
                  },
                  {
                    "w": "Pilate",
                    "u": 1
                  },
                  {
                    "w": "crown of thorns",
                    "u": 1
                  },
                  {
                    "w": "mocked",
                    "u": 1
                  },
                  {
                    "w": "release",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Good Friday:",
                "words": [
                  {
                    "w": "Good Friday",
                    "u": 1
                  },
                  {
                    "w": "crucified",
                    "u": 1
                  },
                  {
                    "w": "Calvary",
                    "u": 1
                  },
                  {
                    "w": "Golgotha",
                    "u": 1
                  },
                  {
                    "w": "Mary Magdalene",
                    "u": 1
                  },
                  {
                    "w": "crucifix",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Easter: \u000bthe resurrection of Jesus",
                "words": [
                  {
                    "w": "Easter Day",
                    "u": 1
                  },
                  {
                    "w": "pierced",
                    "u": 1
                  },
                  {
                    "w": "resurrected",
                    "u": 1
                  },
                  {
                    "w": "Resurrection",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "The risen Jesus appears",
                "words": [
                  {
                    "w": "witnesses",
                    "u": 1
                  },
                  {
                    "w": "depiction",
                    "u": 1
                  },
                  {
                    "w": "depicting",
                    "u": 1
                  },
                  {
                    "w": "haul",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "4",
      "term": "Summer1",
      "cols": {
        "History": [
          {
            "id": "islam-arabia-4summer1",
            "title": "Islam Arabia",
            "chapters": [
              {
                "n": 1,
                "title": "Makkah: a city in a desert",
                "words": [
                  {
                    "w": "pagan",
                    "u": 1
                  },
                  {
                    "w": "Quraysh",
                    "u": 1
                  },
                  {
                    "w": "Aminah",
                    "u": 1
                  },
                  {
                    "w": "idols",
                    "u": 1
                  },
                  {
                    "w": "pilgrims",
                    "u": 1
                  },
                  {
                    "w": "pilgrimage",
                    "u": 1
                  },
                  {
                    "w": "Makkah",
                    "u": 1
                  },
                  {
                    "w": "Kaaba",
                    "u": 1
                  },
                  {
                    "w": "shrines",
                    "u": 2
                  },
                  {
                    "w": "spirits",
                    "u": 1
                  },
                  {
                    "w": "Muhammad",
                    "u": 1
                  },
                  {
                    "w": "dominated",
                    "u": 1
                  },
                  {
                    "w": "Islam",
                    "u": 1
                  },
                  {
                    "w": "Bedouin",
                    "u": 1
                  },
                  {
                    "w": "Arabia",
                    "u": 1
                  },
                  {
                    "w": "desert",
                    "u": 2
                  },
                  {
                    "w": "campfires",
                    "u": 1
                  },
                  {
                    "w": "Arabs",
                    "u": 1
                  },
                  {
                    "w": "recite",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Growing up in the desert",
                "words": [
                  {
                    "w": "Nomad",
                    "u": 1
                  },
                  {
                    "w": "pastoral",
                    "u": 1
                  },
                  {
                    "w": "widows",
                    "u": 1
                  },
                  {
                    "w": "orphans",
                    "u": 1
                  },
                  {
                    "w": "warrior",
                    "u": 1
                  },
                  {
                    "w": "pastoral nomads",
                    "u": 1
                  },
                  {
                    "w": "pastures",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Arabian worlds before Muhammad",
                "words": [
                  {
                    "w": "oases",
                    "u": 2
                  },
                  {
                    "w": "clansmen",
                    "u": 1
                  },
                  {
                    "w": "clans",
                    "u": 1
                  },
                  {
                    "w": "blood feud",
                    "u": 1
                  },
                  {
                    "w": "heritage",
                    "u": 2
                  },
                  {
                    "w": "Petra",
                    "u": 1
                  },
                  {
                    "w": "reared",
                    "u": 1
                  },
                  {
                    "w": "fragrant",
                    "u": 1
                  },
                  {
                    "w": "in praise of",
                    "u": 1
                  },
                  {
                    "w": "ancestors",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "A new message",
                "words": [
                  {
                    "w": "preach",
                    "u": 1
                  },
                  {
                    "w": "paradise",
                    "u": 1
                  },
                  {
                    "w": "submitting",
                    "u": 1
                  },
                  {
                    "w": "Khadijah",
                    "u": 1
                  },
                  {
                    "w": "matchmaker",
                    "u": 1
                  },
                  {
                    "w": "turning point",
                    "u": 1
                  },
                  {
                    "w": "followers",
                    "u": 1
                  },
                  {
                    "w": "revelations",
                    "u": 1
                  },
                  {
                    "w": "submission",
                    "u": 1
                  },
                  {
                    "w": "prayer",
                    "u": 2
                  }
                ]
              },
              {
                "n": 5,
                "title": "Escape to Yathrib",
                "words": [
                  {
                    "w": "plunge",
                    "u": 1
                  },
                  {
                    "w": "disapproved",
                    "u": 1
                  },
                  {
                    "w": "betraying",
                    "u": 1
                  },
                  {
                    "w": "jeering",
                    "u": 1
                  },
                  {
                    "w": "tragedy",
                    "u": 2
                  },
                  {
                    "w": "scorned",
                    "u": 1
                  },
                  {
                    "w": "refugees",
                    "u": 2
                  },
                  {
                    "w": "grove",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Return to Makkah",
                "words": [
                  {
                    "w": "truce",
                    "u": 1
                  },
                  {
                    "w": "Prophet",
                    "u": 2
                  },
                  {
                    "w": "Arabic",
                    "u": 1
                  },
                  {
                    "w": "negotiate",
                    "u": 1
                  },
                  {
                    "w": "Medina",
                    "u": 1
                  },
                  {
                    "w": "mosque",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "earthquakes-4summer1",
            "title": "Earthquakes",
            "chapters": [
              {
                "n": 1,
                "title": "The day that everything shook!",
                "words": [
                  {
                    "w": "earthquake",
                    "u": 1
                  },
                  {
                    "w": "tremors",
                    "u": 1
                  },
                  {
                    "w": "aftershocks",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Why do earthquakes happen?",
                "words": [
                  {
                    "w": "tectonic plates",
                    "u": 1
                  },
                  {
                    "w": "visible",
                    "u": 2
                  },
                  {
                    "w": "plate boundary",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The San Andreas Fault",
                "words": [
                  {
                    "w": "fault line",
                    "u": 1
                  },
                  {
                    "w": "friction",
                    "u": 1
                  },
                  {
                    "w": "San Andreas Fault",
                    "u": 1
                  },
                  {
                    "w": "California",
                    "u": 1
                  },
                  {
                    "w": "seven major plates",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "How can we measure earthquakes?",
                "words": [
                  {
                    "w": "magnitude",
                    "u": 1
                  },
                  {
                    "w": "Richter scale",
                    "u": 1
                  },
                  {
                    "w": "seismogram",
                    "u": 1
                  },
                  {
                    "w": "seismograph",
                    "u": 1
                  },
                  {
                    "w": "seismic waves",
                    "u": 1
                  },
                  {
                    "w": "focus",
                    "u": 2
                  },
                  {
                    "w": "tsunami",
                    "u": 2
                  },
                  {
                    "w": "epicentre",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "What are the effects of earthquakes?",
                "words": [
                  {
                    "w": "trembling",
                    "u": 1
                  },
                  {
                    "w": "long-term effects",
                    "u": 1
                  },
                  {
                    "w": "subsidence",
                    "u": 1
                  },
                  {
                    "w": "landslide",
                    "u": 1
                  },
                  {
                    "w": "rubble",
                    "u": 1
                  },
                  {
                    "w": "environment",
                    "u": 3
                  },
                  {
                    "w": "liquid mud",
                    "u": 1
                  },
                  {
                    "w": "devastate",
                    "u": 1
                  },
                  {
                    "w": "tidal wave",
                    "u": 1
                  },
                  {
                    "w": "immediate effects",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "How do humans live \u000bwith earthquakes?",
                "words": [
                  {
                    "w": "rubber",
                    "u": 1
                  },
                  {
                    "w": "absorb",
                    "u": 1
                  },
                  {
                    "w": "drill",
                    "u": 1
                  },
                  {
                    "w": "prone",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "message-of-jesus-spreads-4summer1",
            "title": "Message of Jesus spreads",
            "chapters": [
              {
                "n": 1,
                "title": "Jesus sends the Spirit\u000b   onto his disciples",
                "words": [
                  {
                    "w": "apostle",
                    "u": 1
                  },
                  {
                    "w": "Acts of the Apostles",
                    "u": 1
                  },
                  {
                    "w": "ascending",
                    "u": 1
                  },
                  {
                    "w": "Ascension",
                    "u": 1
                  },
                  {
                    "w": "apostles",
                    "u": 1
                  },
                  {
                    "w": "address",
                    "u": 1
                  },
                  {
                    "w": "accompanied",
                    "u": 1
                  },
                  {
                    "w": "cast lots",
                    "u": 1
                  },
                  {
                    "w": "Day of Pentecost",
                    "u": 1
                  },
                  {
                    "w": "tongues",
                    "u": 1
                  },
                  {
                    "w": "perplexed",
                    "u": 2
                  }
                ]
              },
              {
                "n": 2,
                "title": "Peter preaches on \u000b    the Day of Pentecost",
                "words": [
                  {
                    "w": "prison cell",
                    "u": 1
                  },
                  {
                    "w": "released",
                    "u": 1
                  },
                  {
                    "w": "educated",
                    "u": 1
                  },
                  {
                    "w": "cornerstone",
                    "u": 1
                  },
                  {
                    "w": "boldness",
                    "u": 1
                  },
                  {
                    "w": "custody",
                    "u": 1
                  },
                  {
                    "w": "sermon",
                    "u": 1
                  },
                  {
                    "w": "colonnade",
                    "u": 1
                  },
                  {
                    "w": "persecuted",
                    "u": 1
                  },
                  {
                    "w": "persecution",
                    "u": 3
                  }
                ]
              },
              {
                "n": 3,
                "title": "Stephen, Saul and",
                "words": [
                  {
                    "w": "appointed",
                    "u": 3
                  },
                  {
                    "w": "regain",
                    "u": 1
                  },
                  {
                    "w": "the road to Damascus",
                    "u": 1
                  },
                  {
                    "w": "bound",
                    "u": 1
                  },
                  {
                    "w": "persecuting",
                    "u": 1
                  },
                  {
                    "w": "persecute",
                    "u": 2
                  },
                  {
                    "w": "speechless",
                    "u": 1
                  },
                  {
                    "w": "guides",
                    "u": 1
                  },
                  {
                    "w": "stoned",
                    "u": 1
                  },
                  {
                    "w": "martyr",
                    "u": 1
                  },
                  {
                    "w": "Stephen",
                    "u": 1
                  },
                  {
                    "w": "community",
                    "u": 1
                  },
                  {
                    "w": "devote",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The message of Jesus",
                "words": [
                  {
                    "w": "forbidden",
                    "u": 1
                  },
                  {
                    "w": "unclean",
                    "u": 1
                  },
                  {
                    "w": "Christians",
                    "u": 1
                  },
                  {
                    "w": "scattered",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Paul writes letters to \u000b       Christian communities",
                "words": [
                  {
                    "w": "epistle",
                    "u": 1
                  },
                  {
                    "w": "Paul",
                    "u": 1
                  },
                  {
                    "w": "bishop",
                    "u": 2
                  },
                  {
                    "w": "bishops",
                    "u": 1
                  },
                  {
                    "w": "hurch",
                    "u": 1
                  },
                  {
                    "w": "numerous",
                    "u": 2
                  },
                  {
                    "w": "Christianity",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The message of",
                "words": [
                  {
                    "w": "interrogated",
                    "u": 1
                  },
                  {
                    "w": "Council of Jerusalem",
                    "u": 1
                  },
                  {
                    "w": "debate",
                    "u": 1
                  },
                  {
                    "w": "shipwrecked",
                    "u": 1
                  },
                  {
                    "w": "catacombs",
                    "u": 1
                  },
                  {
                    "w": "compromise",
                    "u": 1
                  },
                  {
                    "w": "missionary",
                    "u": 2
                  },
                  {
                    "w": "apostolic",
                    "u": 1
                  },
                  {
                    "w": "yoke",
                    "u": 1
                  },
                  {
                    "w": "distinction",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The message of Jesus reaches Rome",
                "words": [
                  {
                    "w": "the body of Christ",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "4",
      "term": "Summer2",
      "cols": {
        "History": [
          {
            "id": "cordoba-4summer2",
            "title": "Cordoba",
            "chapters": [
              {
                "n": 1,
                "title": "Islam bursts out of Arabia",
                "words": [
                  {
                    "w": "Sind",
                    "u": 1
                  },
                  {
                    "w": "advance",
                    "u": 1
                  },
                  {
                    "w": "caliphs",
                    "u": 1
                  },
                  {
                    "w": "warfare",
                    "u": 1
                  },
                  {
                    "w": "warring",
                    "u": 1
                  },
                  {
                    "w": "disputes",
                    "u": 1
                  },
                  {
                    "w": "Samarkand",
                    "u": 1
                  },
                  {
                    "w": "territory",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Why did Islam spread so far, so fast?",
                "words": [
                  {
                    "w": "massacre",
                    "u": 1
                  },
                  {
                    "w": "inheritance",
                    "u": 2
                  },
                  {
                    "w": "taking them captive",
                    "u": 1
                  },
                  {
                    "w": "pride",
                    "u": 1
                  },
                  {
                    "w": "treasurers",
                    "u": 1
                  },
                  {
                    "w": "surveyors",
                    "u": 1
                  },
                  {
                    "w": "dynasty",
                    "u": 1
                  },
                  {
                    "w": "Ummayad",
                    "u": 1
                  },
                  {
                    "w": "Damascus",
                    "u": 1
                  },
                  {
                    "w": "rally round",
                    "u": 1
                  },
                  {
                    "w": "Abbasids",
                    "u": 1
                  },
                  {
                    "w": "unfurled",
                    "u": 1
                  },
                  {
                    "w": "banners",
                    "u": 1
                  },
                  {
                    "w": "Abd al-Rahman",
                    "u": 1
                  },
                  {
                    "w": "booty",
                    "u": 1
                  },
                  {
                    "w": "biblical",
                    "u": 1
                  },
                  {
                    "w": "fugitive",
                    "u": 1
                  },
                  {
                    "w": "tolerant",
                    "u": 1
                  },
                  {
                    "w": "liberators",
                    "u": 1
                  },
                  {
                    "w": "factors",
                    "u": 2
                  }
                ]
              },
              {
                "n": 3,
                "title": "The homesick ruler and the hall of light",
                "words": [
                  {
                    "w": "glance",
                    "u": 1
                  },
                  {
                    "w": "exile",
                    "u": 4
                  },
                  {
                    "w": "homeland",
                    "u": 1
                  },
                  {
                    "w": "stranger",
                    "u": 1
                  },
                  {
                    "w": "emir",
                    "u": 1
                  },
                  {
                    "w": "turban",
                    "u": 1
                  },
                  {
                    "w": "sturdy",
                    "u": 1
                  },
                  {
                    "w": "delicate",
                    "u": 1
                  },
                  {
                    "w": "honour",
                    "u": 1
                  },
                  {
                    "w": "stonemasons",
                    "u": 1
                  },
                  {
                    "w": "urgent",
                    "u": 1
                  },
                  {
                    "w": "Unwinding",
                    "u": 1
                  },
                  {
                    "w": "Cordoba",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "City of learning, city of art",
                "words": [
                  {
                    "w": "clamped down",
                    "u": 1
                  },
                  {
                    "w": "lute",
                    "u": 1
                  },
                  {
                    "w": "musician",
                    "u": 1
                  },
                  {
                    "w": "jade",
                    "u": 1
                  },
                  {
                    "w": "aisles",
                    "u": 1
                  },
                  {
                    "w": "minaret",
                    "u": 2
                  },
                  {
                    "w": "Peoples of the Book",
                    "u": 1
                  },
                  {
                    "w": "locust",
                    "u": 1
                  },
                  {
                    "w": "provoked",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "City of three religions",
                "words": [
                  {
                    "w": "extension",
                    "u": 1
                  },
                  {
                    "w": "splendour",
                    "u": 1
                  },
                  {
                    "w": "ancestors",
                    "u": 2
                  },
                  {
                    "w": "sought out",
                    "u": 1
                  },
                  {
                    "w": "mihrab",
                    "u": 1
                  },
                  {
                    "w": "adapted",
                    "u": 2
                  },
                  {
                    "w": "production",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "“You have destroyed what was unique in the world”",
                "words": [
                  {
                    "w": "town council",
                    "u": 2
                  },
                  {
                    "w": "permission",
                    "u": 1
                  },
                  {
                    "w": "unique",
                    "u": 3
                  },
                  {
                    "w": "Berbers",
                    "u": 1
                  },
                  {
                    "w": "deadly",
                    "u": 1
                  },
                  {
                    "w": "Almohads",
                    "u": 1
                  },
                  {
                    "w": "momentum",
                    "u": 1
                  },
                  {
                    "w": "expelled",
                    "u": 2
                  },
                  {
                    "w": "triumph",
                    "u": 1
                  },
                  {
                    "w": "cathedral",
                    "u": 3
                  },
                  {
                    "w": "enraged",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "deserts-4summer2",
            "title": "Deserts",
            "chapters": [
              {
                "n": 1,
                "title": "Are deserts always hot?",
                "words": [
                  {
                    "w": "vegetation",
                    "u": 1
                  },
                  {
                    "w": "plummet",
                    "u": 1
                  },
                  {
                    "w": "Desert",
                    "u": 2
                  },
                  {
                    "w": "hydrated",
                    "u": 1
                  },
                  {
                    "w": "dehydrated",
                    "u": 1
                  },
                  {
                    "w": "arid",
                    "u": 1
                  },
                  {
                    "w": "Sahara Desert",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The Sahara Desert",
                "words": [
                  {
                    "w": "oasis",
                    "u": 1
                  },
                  {
                    "w": "oases",
                    "u": 2
                  },
                  {
                    "w": "semi-arid",
                    "u": 2
                  },
                  {
                    "w": "Sahel",
                    "u": 1
                  },
                  {
                    "w": "camels",
                    "u": 1
                  },
                  {
                    "w": "store",
                    "u": 1
                  },
                  {
                    "w": "drought",
                    "u": 1
                  },
                  {
                    "w": "sand dunes",
                    "u": 2
                  },
                  {
                    "w": "lush",
                    "u": 2
                  }
                ]
              },
              {
                "n": 3,
                "title": "How are deserts formed?",
                "words": [
                  {
                    "w": "physical",
                    "u": 1
                  },
                  {
                    "w": "Overfarming",
                    "u": 1
                  },
                  {
                    "w": "desertification",
                    "u": 1
                  },
                  {
                    "w": "nutrients",
                    "u": 2
                  },
                  {
                    "w": "overgrazing",
                    "u": 1
                  },
                  {
                    "w": "herd",
                    "u": 1
                  },
                  {
                    "w": "productive",
                    "u": 1
                  },
                  {
                    "w": "non-productive",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "What plants and animals",
                "words": [
                  {
                    "w": "blubber",
                    "u": 1
                  },
                  {
                    "w": "Polar bears",
                    "u": 1
                  },
                  {
                    "w": "penguins",
                    "u": 1
                  },
                  {
                    "w": "Antarctica",
                    "u": 1
                  },
                  {
                    "w": "chameleon",
                    "u": 1
                  },
                  {
                    "w": "nocturnal",
                    "u": 1
                  },
                  {
                    "w": "desolate",
                    "u": 1
                  },
                  {
                    "w": "meerkat",
                    "u": 1
                  },
                  {
                    "w": "prevent",
                    "u": 1
                  },
                  {
                    "w": "spines",
                    "u": 1
                  },
                  {
                    "w": "obtain",
                    "u": 2
                  },
                  {
                    "w": "fauna",
                    "u": 1
                  },
                  {
                    "w": "cacti",
                    "u": 1
                  },
                  {
                    "w": "flora",
                    "u": 1
                  },
                  {
                    "w": "variety",
                    "u": 1
                  },
                  {
                    "w": "cactus",
                    "u": 1
                  },
                  {
                    "w": "succulents",
                    "u": 1
                  },
                  {
                    "w": "lichen",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "How have humans used deserts?",
                "words": [
                  {
                    "w": "tents",
                    "u": 1
                  },
                  {
                    "w": "portable",
                    "u": 1
                  },
                  {
                    "w": "yurts",
                    "u": 1
                  },
                  {
                    "w": "Silk Road",
                    "u": 1
                  },
                  {
                    "w": "Great Steppe",
                    "u": 1
                  },
                  {
                    "w": "steppe",
                    "u": 1
                  },
                  {
                    "w": "indigenous",
                    "u": 1
                  },
                  {
                    "w": "divert",
                    "u": 2
                  },
                  {
                    "w": "modern",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The Patagonian Desert",
                "words": [
                  {
                    "w": "extinct",
                    "u": 2
                  },
                  {
                    "w": "exposes",
                    "u": 1
                  },
                  {
                    "w": "feature",
                    "u": 1
                  },
                  {
                    "w": "exceeds",
                    "u": 1
                  },
                  {
                    "w": "hostile",
                    "u": 1
                  },
                  {
                    "w": "rain shadow",
                    "u": 1
                  },
                  {
                    "w": "Patagonia",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "islam-1-ramadan-4summer2",
            "title": "Islam 1 Ramadan",
            "chapters": [
              {
                "n": 1,
                "title": "The crescent Moon",
                "words": [
                  {
                    "w": "illuminates",
                    "u": 1
                  },
                  {
                    "w": "crescent",
                    "u": 1
                  },
                  {
                    "w": "Ramadan",
                    "u": 1
                  },
                  {
                    "w": "iftar",
                    "u": 1
                  },
                  {
                    "w": "break their fast",
                    "u": 1
                  },
                  {
                    "w": "dusk",
                    "u": 1
                  },
                  {
                    "w": "thread",
                    "u": 1
                  },
                  {
                    "w": "suhoor",
                    "u": 1
                  },
                  {
                    "w": "at first light",
                    "u": 1
                  },
                  {
                    "w": "sliver",
                    "u": 1
                  },
                  {
                    "w": "lunar",
                    "u": 1
                  },
                  {
                    "w": "phases of the Moon",
                    "u": 1
                  },
                  {
                    "w": "cycle",
                    "u": 1
                  },
                  {
                    "w": "full moon",
                    "u": 1
                  },
                  {
                    "w": "new moon",
                    "u": 1
                  },
                  {
                    "w": "marvelled",
                    "u": 1
                  },
                  {
                    "w": "straining",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The holiest month",
                "words": [
                  {
                    "w": "corrupted",
                    "u": 1
                  },
                  {
                    "w": "Seal of the Prophets",
                    "u": 1
                  },
                  {
                    "w": "lanterns",
                    "u": 1
                  },
                  {
                    "w": "the Prophet Muhammad",
                    "u": 1
                  },
                  {
                    "w": "scriptures",
                    "u": 1
                  },
                  {
                    "w": "Jibril",
                    "u": 1
                  },
                  {
                    "w": "Night of Power",
                    "u": 1
                  },
                  {
                    "w": "reverence",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Masuma’s Ramadan",
                "words": [
                  {
                    "w": "zakat",
                    "u": 1
                  },
                  {
                    "w": "charity",
                    "u": 1
                  },
                  {
                    "w": "ease",
                    "u": 1
                  },
                  {
                    "w": "hardship",
                    "u": 1
                  },
                  {
                    "w": "themes",
                    "u": 1
                  },
                  {
                    "w": "wholesome",
                    "u": 1
                  },
                  {
                    "w": "spiritual",
                    "u": 1
                  },
                  {
                    "w": "imam",
                    "u": 1
                  },
                  {
                    "w": "prioritise",
                    "u": 1
                  },
                  {
                    "w": "character",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Fasting, faith and community",
                "words": [
                  {
                    "w": "faults",
                    "u": 1
                  },
                  {
                    "w": "mindful",
                    "u": 1
                  },
                  {
                    "w": "minaret",
                    "u": 2
                  },
                  {
                    "w": "glorify",
                    "u": 1
                  },
                  {
                    "w": "obedience",
                    "u": 1
                  },
                  {
                    "w": "Hadith",
                    "u": 1
                  },
                  {
                    "w": "deeds",
                    "u": 1
                  },
                  {
                    "w": "compassion",
                    "u": 1
                  },
                  {
                    "w": "Sawm",
                    "u": 1
                  },
                  {
                    "w": "reflect",
                    "u": 1
                  },
                  {
                    "w": "mankind",
                    "u": 1
                  },
                  {
                    "w": "muezzin",
                    "u": 1
                  },
                  {
                    "w": "distract",
                    "u": 1
                  },
                  {
                    "w": "distracting",
                    "u": 1
                  },
                  {
                    "w": "prescribed",
                    "u": 2
                  }
                ]
              },
              {
                "n": 5,
                "title": "Zerrin’s Ramadan",
                "words": [
                  {
                    "w": "salah",
                    "u": 1
                  },
                  {
                    "w": "occupy",
                    "u": 1
                  },
                  {
                    "w": "reflections",
                    "u": 1
                  },
                  {
                    "w": "couscous",
                    "u": 1
                  },
                  {
                    "w": "Eid",
                    "u": 1
                  },
                  {
                    "w": "madrasa",
                    "u": 1
                  },
                  {
                    "w": "Khatam",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Eid ul-Fitr",
                "words": [
                  {
                    "w": "Eid ul-Fitr",
                    "u": 1
                  },
                  {
                    "w": "sliver of the new moon",
                    "u": 1
                  },
                  {
                    "w": "purify",
                    "u": 1
                  },
                  {
                    "w": "donations",
                    "u": 1
                  },
                  {
                    "w": "Eid Mubarek",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "5",
      "term": "Autumn1",
      "cols": {
        "History": [
          {
            "id": "baghdad-5autumn1",
            "title": "Baghdad",
            "chapters": [
              {
                "n": 0,
                "title": "0",
                "words": [
                  {
                    "w": "reconstruction",
                    "u": 1
                  },
                  {
                    "w": "Caspian Sea",
                    "u": 1
                  },
                  {
                    "w": "The round city: Baghdad",
                    "u": 1
                  },
                  {
                    "w": "medical encyclopaedia",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "Perfect time for the perfect city",
                "words": [
                  {
                    "w": "astrologers",
                    "u": 1
                  },
                  {
                    "w": "descendants",
                    "u": 1
                  },
                  {
                    "w": "establish",
                    "u": 1
                  },
                  {
                    "w": "al-Mansur",
                    "u": 1
                  },
                  {
                    "w": "Baghdad",
                    "u": 1
                  },
                  {
                    "w": "dirhams",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Perfect place for the perfect city",
                "words": [
                  {
                    "w": "silk roads",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Building the perfect city",
                "words": [
                  {
                    "w": "revenue",
                    "u": 1
                  },
                  {
                    "w": "peter out",
                    "u": 1
                  },
                  {
                    "w": "quilts",
                    "u": 1
                  },
                  {
                    "w": "dome",
                    "u": 1
                  },
                  {
                    "w": "engineers",
                    "u": 1
                  },
                  {
                    "w": "decree",
                    "u": 4
                  }
                ]
              },
              {
                "n": 4,
                "title": "City of books and learning: the House of Wisdom",
                "words": [
                  {
                    "w": "madrasas",
                    "u": 1
                  },
                  {
                    "w": "universities",
                    "u": 1
                  },
                  {
                    "w": "scholars",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Learning about the world: astronomy, maths, geography",
                "words": [
                  {
                    "w": "astrology",
                    "u": 1
                  },
                  {
                    "w": "predict",
                    "u": 1
                  },
                  {
                    "w": "astrolabe",
                    "u": 1
                  },
                  {
                    "w": "numerals",
                    "u": 1
                  },
                  {
                    "w": "observatories",
                    "u": 1
                  },
                  {
                    "w": "calculate",
                    "u": 1
                  },
                  {
                    "w": "evolved",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Changing the world: \u000bscience, technology and medicine",
                "words": [
                  {
                    "w": "antiseptic",
                    "u": 1
                  },
                  {
                    "w": "minerals",
                    "u": 1
                  },
                  {
                    "w": "optics",
                    "u": 1
                  },
                  {
                    "w": "lenses",
                    "u": 1
                  },
                  {
                    "w": "rays of light",
                    "u": 1
                  },
                  {
                    "w": "compass",
                    "u": 1
                  },
                  {
                    "w": "surgical",
                    "u": 1
                  },
                  {
                    "w": "surgeons",
                    "u": 1
                  },
                  {
                    "w": "influence",
                    "u": 1
                  },
                  {
                    "w": "Qualified",
                    "u": 1
                  },
                  {
                    "w": "qualifications",
                    "u": 1
                  },
                  {
                    "w": "smallpox",
                    "u": 1
                  },
                  {
                    "w": "medical",
                    "u": 1
                  },
                  {
                    "w": "surgery",
                    "u": 1
                  },
                  {
                    "w": "nerves",
                    "u": 1
                  },
                  {
                    "w": "arteries",
                    "u": 1
                  },
                  {
                    "w": "anatomy",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "california-thirsty-5autumn1",
            "title": "California-thirsty",
            "chapters": [
              {
                "n": 1,
                "title": "Thirsty humans",
                "words": [
                  {
                    "w": "treated",
                    "u": 1
                  },
                  {
                    "w": "Arizona",
                    "u": 1
                  },
                  {
                    "w": "state lines",
                    "u": 1
                  },
                  {
                    "w": "Los Angeles",
                    "u": 1
                  },
                  {
                    "w": "abundant",
                    "u": 1
                  },
                  {
                    "w": "scant",
                    "u": 1
                  },
                  {
                    "w": "iconic",
                    "u": 1
                  },
                  {
                    "w": "vital",
                    "u": 1
                  },
                  {
                    "w": "precipitation",
                    "u": 1
                  }
                ]
              },
              {
                "n": 0,
                "title": "2",
                "words": [
                  {
                    "w": "unpredictable downpours",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "A thirsty land",
                "words": [
                  {
                    "w": "sufficient",
                    "u": 1
                  },
                  {
                    "w": "snowmelt",
                    "u": 1
                  },
                  {
                    "w": "Colorado River",
                    "u": 1
                  },
                  {
                    "w": "radiant",
                    "u": 1
                  },
                  {
                    "w": "barren",
                    "u": 2
                  },
                  {
                    "w": "rugged",
                    "u": 1
                  },
                  {
                    "w": "mesas",
                    "u": 1
                  },
                  {
                    "w": "obtain",
                    "u": 2
                  },
                  {
                    "w": "veneer",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Why is California running out of water?",
                "words": [
                  {
                    "w": "brackish",
                    "u": 1
                  },
                  {
                    "w": "intensified",
                    "u": 2
                  },
                  {
                    "w": "insufficient",
                    "u": 1
                  },
                  {
                    "w": "unwholesome",
                    "u": 1
                  },
                  {
                    "w": "vividly",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Growing almonds",
                "words": [
                  {
                    "w": "factors",
                    "u": 2
                  },
                  {
                    "w": "water supply",
                    "u": 1
                  },
                  {
                    "w": "Almonds",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The California Aqueduct",
                "words": [
                  {
                    "w": "drought-prone",
                    "u": 1
                  },
                  {
                    "w": "California Aqueduct",
                    "u": 1
                  },
                  {
                    "w": "remarkable",
                    "u": 1
                  },
                  {
                    "w": "lawn",
                    "u": 1
                  },
                  {
                    "w": "native plants",
                    "u": 1
                  },
                  {
                    "w": "drought-tolerant",
                    "u": 1
                  },
                  {
                    "w": "residents",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "What next for California?",
                "words": [
                  {
                    "w": "deluges",
                    "u": 1
                  },
                  {
                    "w": "crucially",
                    "u": 1
                  },
                  {
                    "w": "trend",
                    "u": 2
                  },
                  {
                    "w": "crucial",
                    "u": 2
                  },
                  {
                    "w": "compressed",
                    "u": 1
                  },
                  {
                    "w": "snowpack",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "islam-2-stories-of-the-prophets-5autumn1",
            "title": "Islam 2 Stories of the Prophets",
            "chapters": [
              {
                "n": 1,
                "title": "Messengers of God",
                "words": [
                  {
                    "w": "Hawwa",
                    "u": 1
                  },
                  {
                    "w": "Prophetic",
                    "u": 1
                  },
                  {
                    "w": "Adam",
                    "u": 1
                  },
                  {
                    "w": "role models",
                    "u": 1
                  },
                  {
                    "w": "glimpses",
                    "u": 1
                  },
                  {
                    "w": "unique to",
                    "u": 1
                  },
                  {
                    "w": "in common",
                    "u": 1
                  },
                  {
                    "w": "scholar",
                    "u": 1
                  },
                  {
                    "w": "kutub",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The first prophet",
                "words": [
                  {
                    "w": "arrogant",
                    "u": 1
                  },
                  {
                    "w": "wretched",
                    "u": 1
                  },
                  {
                    "w": "arrogance",
                    "u": 1
                  },
                  {
                    "w": "misery",
                    "u": 1
                  },
                  {
                    "w": "astray",
                    "u": 1
                  },
                  {
                    "w": "Arafat",
                    "u": 1
                  },
                  {
                    "w": "toil",
                    "u": 1
                  },
                  {
                    "w": "blissful",
                    "u": 1
                  },
                  {
                    "w": "haughtiness",
                    "u": 1
                  },
                  {
                    "w": "Haughty",
                    "u": 1
                  },
                  {
                    "w": "Shaytun",
                    "u": 1
                  },
                  {
                    "w": "prosper",
                    "u": 1
                  },
                  {
                    "w": "thrive",
                    "u": 1
                  },
                  {
                    "w": "khalifa",
                    "u": 1
                  },
                  {
                    "w": "eternity",
                    "u": 1
                  },
                  {
                    "w": "existed",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The great flood",
                "words": [
                  {
                    "w": "Nuh",
                    "u": 1
                  },
                  {
                    "w": "refuge",
                    "u": 1
                  },
                  {
                    "w": "vanity",
                    "u": 1
                  },
                  {
                    "w": "perseverance",
                    "u": 1
                  },
                  {
                    "w": "subside",
                    "u": 1
                  },
                  {
                    "w": "ceased",
                    "u": 1
                  },
                  {
                    "w": "taunted",
                    "u": 1
                  },
                  {
                    "w": "persevered",
                    "u": 1
                  },
                  {
                    "w": "lowly",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Ibrahim’s call",
                "words": [
                  {
                    "w": "miraculous",
                    "u": 1
                  },
                  {
                    "w": "humiliated",
                    "u": 1
                  },
                  {
                    "w": "barren",
                    "u": 2
                  },
                  {
                    "w": "dismayed",
                    "u": 1
                  },
                  {
                    "w": "steadfast",
                    "u": 1
                  },
                  {
                    "w": "dedication",
                    "u": 1
                  },
                  {
                    "w": "moral of the story",
                    "u": 1
                  },
                  {
                    "w": "Ibrahim",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Musa listens to God",
                "words": [
                  {
                    "w": "conceal",
                    "u": 1
                  },
                  {
                    "w": "hurriedly",
                    "u": 1
                  },
                  {
                    "w": "continuous",
                    "u": 1
                  },
                  {
                    "w": "Narration",
                    "u": 1
                  },
                  {
                    "w": "narrative",
                    "u": 1
                  },
                  {
                    "w": "bride-price",
                    "u": 1
                  },
                  {
                    "w": "longing",
                    "u": 2
                  },
                  {
                    "w": "firebrand",
                    "u": 1
                  },
                  {
                    "w": "despair",
                    "u": 1
                  },
                  {
                    "w": "prospect",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Dawud and Sulayman",
                "words": [
                  {
                    "w": "Dawud",
                    "u": 1
                  },
                  {
                    "w": "ushered",
                    "u": 1
                  },
                  {
                    "w": "penitent",
                    "u": 1
                  },
                  {
                    "w": "falsehood",
                    "u": 1
                  },
                  {
                    "w": "echo",
                    "u": 1
                  },
                  {
                    "w": "prophethood",
                    "u": 1
                  },
                  {
                    "w": "Sulayman",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "5",
      "term": "Autumn2",
      "cols": {
        "History": [
          {
            "id": "anglo-saxons-5autumn2",
            "title": "Anglo Saxons",
            "chapters": [
              {
                "n": 1,
                "title": "Attacks by land and sea",
                "words": [
                  {
                    "w": "Anglo-Saxon",
                    "u": 1
                  },
                  {
                    "w": "Picts",
                    "u": 1
                  },
                  {
                    "w": "Saxons",
                    "u": 1
                  },
                  {
                    "w": "pleas",
                    "u": 1
                  },
                  {
                    "w": "Angles",
                    "u": 1
                  },
                  {
                    "w": "Jutes",
                    "u": 1
                  },
                  {
                    "w": "Germanic",
                    "u": 1
                  },
                  {
                    "w": "North Sea",
                    "u": 2
                  },
                  {
                    "w": "pillaged",
                    "u": 1
                  },
                  {
                    "w": "Scots",
                    "u": 1
                  },
                  {
                    "w": "Anglo-Saxons",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "How did the migrations happen?",
                "words": [
                  {
                    "w": "migrate",
                    "u": 2
                  },
                  {
                    "w": "migrating",
                    "u": 1
                  },
                  {
                    "w": "battle-axe",
                    "u": 1
                  },
                  {
                    "w": "Britons",
                    "u": 1
                  },
                  {
                    "w": "Frankish",
                    "u": 1
                  },
                  {
                    "w": "throwing axe",
                    "u": 1
                  },
                  {
                    "w": "overcome",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Connected kingdoms",
                "words": [
                  {
                    "w": "widowed",
                    "u": 1
                  },
                  {
                    "w": "ranks",
                    "u": 2
                  },
                  {
                    "w": "status",
                    "u": 1
                  },
                  {
                    "w": "compensation",
                    "u": 1
                  },
                  {
                    "w": "settle their differences",
                    "u": 1
                  },
                  {
                    "w": "glassware",
                    "u": 1
                  },
                  {
                    "w": "high-status",
                    "u": 1
                  },
                  {
                    "w": "noblewomen",
                    "u": 1
                  },
                  {
                    "w": "high-born",
                    "u": 1
                  },
                  {
                    "w": "artefacts",
                    "u": 1
                  },
                  {
                    "w": "buckle",
                    "u": 1
                  },
                  {
                    "w": "amber",
                    "u": 1
                  },
                  {
                    "w": "conclude",
                    "u": 1
                  },
                  {
                    "w": "grave goods",
                    "u": 1
                  },
                  {
                    "w": "nobleman",
                    "u": 1
                  },
                  {
                    "w": "chief",
                    "u": 1
                  },
                  {
                    "w": "garnet",
                    "u": 1
                  },
                  {
                    "w": "Sri Lanka",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "‘Not Angles, but angels’",
                "words": [
                  {
                    "w": "Hilda",
                    "u": 1
                  },
                  {
                    "w": "missionary",
                    "u": 2
                  },
                  {
                    "w": "missionaries",
                    "u": 1
                  },
                  {
                    "w": "Bede",
                    "u": 1
                  },
                  {
                    "w": "Columba",
                    "u": 1
                  },
                  {
                    "w": "Easter",
                    "u": 1
                  },
                  {
                    "w": "Synod of Whitby",
                    "u": 1
                  },
                  {
                    "w": "overlord",
                    "u": 1
                  },
                  {
                    "w": "Canterbury",
                    "u": 1
                  },
                  {
                    "w": "Augustine",
                    "u": 1
                  },
                  {
                    "w": "monasteries",
                    "u": 1
                  },
                  {
                    "w": "monks",
                    "u": 1
                  },
                  {
                    "w": "scholarship",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Mercia: a changing kingdom",
                "words": [
                  {
                    "w": "worn on",
                    "u": 1
                  },
                  {
                    "w": "security",
                    "u": 1
                  },
                  {
                    "w": "abbey",
                    "u": 1
                  },
                  {
                    "w": "abbess",
                    "u": 1
                  },
                  {
                    "w": "Offa’s Dyke",
                    "u": 1
                  },
                  {
                    "w": "barrier",
                    "u": 1
                  },
                  {
                    "w": "wore on",
                    "u": 1
                  },
                  {
                    "w": "Offa",
                    "u": 1
                  },
                  {
                    "w": "Cynethryth",
                    "u": 1
                  },
                  {
                    "w": "authority",
                    "u": 3
                  },
                  {
                    "w": "charters",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "What was found at Sutton Hoo?",
                "words": [
                  {
                    "w": "meandering",
                    "u": 1
                  },
                  {
                    "w": "trowel",
                    "u": 1
                  },
                  {
                    "w": "unearthing",
                    "u": 1
                  },
                  {
                    "w": "self-taught",
                    "u": 1
                  },
                  {
                    "w": "earthen mounds",
                    "u": 1
                  },
                  {
                    "w": "rivet",
                    "u": 1
                  },
                  {
                    "w": "silverware",
                    "u": 1
                  },
                  {
                    "w": "helmet",
                    "u": 1
                  },
                  {
                    "w": "decomposed",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "oceans-5autumn2",
            "title": "Oceans",
            "chapters": [
              {
                "n": 1,
                "title": "Oceans and seas",
                "words": [
                  {
                    "w": "north pole",
                    "u": 1
                  },
                  {
                    "w": "salinity",
                    "u": 1
                  },
                  {
                    "w": "south pole",
                    "u": 1
                  },
                  {
                    "w": "the Atlantic",
                    "u": 1
                  },
                  {
                    "w": "Atlantic Ocean",
                    "u": 2
                  },
                  {
                    "w": "World Ocean",
                    "u": 1
                  },
                  {
                    "w": "Pacific Ocean",
                    "u": 1
                  },
                  {
                    "w": "nearly enclosed",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Oceans and trade",
                "words": [
                  {
                    "w": "manufactured goods",
                    "u": 1
                  },
                  {
                    "w": "quantities",
                    "u": 1
                  },
                  {
                    "w": "freight",
                    "u": 1
                  },
                  {
                    "w": "maritime shipping routes",
                    "u": 1
                  },
                  {
                    "w": "trade",
                    "u": 2
                  },
                  {
                    "w": "transported",
                    "u": 1
                  },
                  {
                    "w": "maritime trade",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Oceans and climate",
                "words": [
                  {
                    "w": "gyres",
                    "u": 1
                  },
                  {
                    "w": "phytoplankton",
                    "u": 1
                  },
                  {
                    "w": "ocean currents",
                    "u": 1
                  },
                  {
                    "w": "warm currents",
                    "u": 1
                  },
                  {
                    "w": "cold currents",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Oceans and land masses",
                "words": [
                  {
                    "w": "earthquakes",
                    "u": 1
                  },
                  {
                    "w": "oceanic",
                    "u": 1
                  },
                  {
                    "w": "Atlantic coast",
                    "u": 1
                  },
                  {
                    "w": "Caribbean",
                    "u": 1
                  },
                  {
                    "w": "Hurricanes",
                    "u": 1
                  },
                  {
                    "w": "wind stream",
                    "u": 1
                  },
                  {
                    "w": "tsunami",
                    "u": 2
                  }
                ]
              },
              {
                "n": 5,
                "title": "Oceans and climate change",
                "words": [
                  {
                    "w": "regulates",
                    "u": 1
                  },
                  {
                    "w": "fossil fuels",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The human impact on oceans",
                "words": [
                  {
                    "w": "marine life",
                    "u": 1
                  },
                  {
                    "w": "drift-net fishing",
                    "u": 1
                  },
                  {
                    "w": "Aral Sea",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "islam-3-living-muslim-trads-5autumn2",
            "title": "Islam 3 Living Muslim trads",
            "chapters": [
              {
                "n": 1,
                "title": "Amira and her ancient city",
                "words": [
                  {
                    "w": "context",
                    "u": 1
                  },
                  {
                    "w": "congregational",
                    "u": 1
                  },
                  {
                    "w": "distinguishes",
                    "u": 1
                  },
                  {
                    "w": "prostrating",
                    "u": 1
                  },
                  {
                    "w": "legacy",
                    "u": 1
                  },
                  {
                    "w": "maritime",
                    "u": 1
                  },
                  {
                    "w": "Renowned",
                    "u": 1
                  },
                  {
                    "w": "Phoenicia",
                    "u": 1
                  },
                  {
                    "w": "congregation",
                    "u": 1
                  },
                  {
                    "w": "Phoenicians",
                    "u": 1
                  },
                  {
                    "w": "Sidon",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Fida, in Beirut, tells us about prayer",
                "words": [
                  {
                    "w": "branches",
                    "u": 1
                  },
                  {
                    "w": "Sunni",
                    "u": 1
                  },
                  {
                    "w": "restrictions",
                    "u": 1
                  },
                  {
                    "w": "solidarity",
                    "u": 1
                  },
                  {
                    "w": "humanity",
                    "u": 1
                  },
                  {
                    "w": "values",
                    "u": 1
                  },
                  {
                    "w": "universal",
                    "u": 1
                  },
                  {
                    "w": "evaluate",
                    "u": 1
                  },
                  {
                    "w": "instability",
                    "u": 1
                  },
                  {
                    "w": "Beirut",
                    "u": 1
                  },
                  {
                    "w": "Shia",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "United in prayer: salah",
                "words": [
                  {
                    "w": "linger",
                    "u": 1
                  },
                  {
                    "w": "Saudi Arabia",
                    "u": 1
                  },
                  {
                    "w": "Lebanon",
                    "u": 1
                  },
                  {
                    "w": "haunting",
                    "u": 1
                  },
                  {
                    "w": "dua",
                    "u": 1
                  },
                  {
                    "w": "formal",
                    "u": 1
                  },
                  {
                    "w": "virtue",
                    "u": 1
                  },
                  {
                    "w": "intention",
                    "u": 1
                  },
                  {
                    "w": "wudu",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Hassan and Maya talk about prayer",
                "words": [
                  {
                    "w": "serene",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Five pillars and ten acts",
                "words": [
                  {
                    "w": "hajj",
                    "u": 1
                  },
                  {
                    "w": "entrusts",
                    "u": 1
                  },
                  {
                    "w": "charitable",
                    "u": 1
                  },
                  {
                    "w": "Day of Judgement",
                    "u": 1
                  },
                  {
                    "w": "obligation",
                    "u": 1
                  },
                  {
                    "w": "declare",
                    "u": 1
                  },
                  {
                    "w": "solemn",
                    "u": 1
                  },
                  {
                    "w": "observing",
                    "u": 1
                  },
                  {
                    "w": "declaration",
                    "u": 1
                  },
                  {
                    "w": "shahadah",
                    "u": 1
                  },
                  {
                    "w": "Five Pillars of Islam",
                    "u": 1
                  },
                  {
                    "w": "Ten Obligatory Acts",
                    "u": 1
                  },
                  {
                    "w": "essence",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "khums – giving 20%",
                "words": [
                  {
                    "w": "welfare",
                    "u": 3
                  }
                ]
              },
              {
                "n": 6,
                "title": "Hajj: a holy pilgrimage",
                "words": [
                  {
                    "w": "in vain",
                    "u": 1
                  },
                  {
                    "w": "serenity",
                    "u": 1
                  },
                  {
                    "w": "garments",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "5",
      "term": "Spring1",
      "cols": {
        "History": [
          {
            "id": "vikings-1_aethelflaed-5spring1",
            "title": "Vikings 1_Aethelflaed",
            "chapters": [
              {
                "n": 1,
                "title": "Strange oars on the Trent: \u000bMercia falls",
                "words": [
                  {
                    "w": "abandon",
                    "u": 2
                  },
                  {
                    "w": "seat of royal power",
                    "u": 1
                  },
                  {
                    "w": "daring",
                    "u": 1
                  },
                  {
                    "w": "spindle whorl",
                    "u": 1
                  },
                  {
                    "w": "spindle",
                    "u": 1
                  },
                  {
                    "w": "Norsemen",
                    "u": 1
                  },
                  {
                    "w": "ploughshare",
                    "u": 1
                  },
                  {
                    "w": "seeping",
                    "u": 1
                  },
                  {
                    "w": "flanks",
                    "u": 1
                  },
                  {
                    "w": "chasms",
                    "u": 1
                  },
                  {
                    "w": "furrows",
                    "u": 1
                  },
                  {
                    "w": "Anglo-Saxon Chronicle",
                    "u": 1
                  },
                  {
                    "w": "crypt",
                    "u": 1
                  },
                  {
                    "w": "ingots",
                    "u": 1
                  },
                  {
                    "w": "launch",
                    "u": 1
                  },
                  {
                    "w": "wintered",
                    "u": 1
                  },
                  {
                    "w": "Vikings",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Early Viking raids",
                "words": [
                  {
                    "w": "illuminated",
                    "u": 1
                  },
                  {
                    "w": "tremble",
                    "u": 1
                  },
                  {
                    "w": "encounter",
                    "u": 2
                  },
                  {
                    "w": "claiming",
                    "u": 1
                  },
                  {
                    "w": "According to",
                    "u": 1
                  },
                  {
                    "w": "martyrdom",
                    "u": 1
                  },
                  {
                    "w": "widespread",
                    "u": 1
                  },
                  {
                    "w": "pace",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Wessex alone",
                "words": [
                  {
                    "w": "warlord",
                    "u": 1
                  },
                  {
                    "w": "to and fro",
                    "u": 1
                  },
                  {
                    "w": "campaigns",
                    "u": 1
                  },
                  {
                    "w": "prowled",
                    "u": 1
                  },
                  {
                    "w": "at bay",
                    "u": 1
                  },
                  {
                    "w": "ferociously",
                    "u": 1
                  },
                  {
                    "w": "in a good light",
                    "u": 1
                  },
                  {
                    "w": "decisive",
                    "u": 1
                  },
                  {
                    "w": "learned",
                    "u": 1
                  },
                  {
                    "w": "depicts",
                    "u": 1
                  },
                  {
                    "w": "re-enacting",
                    "u": 1
                  },
                  {
                    "w": "threatening",
                    "u": 1
                  },
                  {
                    "w": "occupied",
                    "u": 1
                  },
                  {
                    "w": "sought",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Three surprises and a wedding:",
                "words": [
                  {
                    "w": "war-bands",
                    "u": 1
                  },
                  {
                    "w": "grave",
                    "u": 1
                  },
                  {
                    "w": "ealdorman",
                    "u": 1
                  },
                  {
                    "w": "shires",
                    "u": 1
                  },
                  {
                    "w": "ransacked",
                    "u": 1
                  },
                  {
                    "w": "forage",
                    "u": 1
                  },
                  {
                    "w": "triumphantly",
                    "u": 1
                  },
                  {
                    "w": "residence",
                    "u": 1
                  },
                  {
                    "w": "ancestral",
                    "u": 1
                  },
                  {
                    "w": "commotion",
                    "u": 1
                  },
                  {
                    "w": "triumphed",
                    "u": 1
                  },
                  {
                    "w": "font",
                    "u": 1
                  },
                  {
                    "w": "hilt",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Rebuilding Mercia",
                "words": [
                  {
                    "w": "burhs",
                    "u": 1
                  },
                  {
                    "w": "fortifications",
                    "u": 1
                  },
                  {
                    "w": "wary",
                    "u": 1
                  },
                  {
                    "w": "rampage",
                    "u": 1
                  },
                  {
                    "w": "fortify",
                    "u": 1
                  },
                  {
                    "w": "shore up",
                    "u": 1
                  },
                  {
                    "w": "priory",
                    "u": 1
                  },
                  {
                    "w": "wilderness",
                    "u": 1
                  },
                  {
                    "w": "witan",
                    "u": 1
                  },
                  {
                    "w": "prosperous",
                    "u": 3
                  },
                  {
                    "w": "fortified",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "Bolder and bolder",
                "words": [
                  {
                    "w": "reputation",
                    "u": 1
                  },
                  {
                    "w": "Lady of the Mercians",
                    "u": 1
                  },
                  {
                    "w": "boulders",
                    "u": 1
                  },
                  {
                    "w": "vividly",
                    "u": 2
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "migration-5spring1",
            "title": "Migration",
            "chapters": [
              {
                "n": 1,
                "title": "Danielle’s migration story",
                "words": [
                  {
                    "w": "Newry",
                    "u": 1
                  },
                  {
                    "w": "remote",
                    "u": 1
                  },
                  {
                    "w": "Mourne Mountains",
                    "u": 1
                  },
                  {
                    "w": "populated",
                    "u": 1
                  },
                  {
                    "w": "descended",
                    "u": 3
                  },
                  {
                    "w": "migrants",
                    "u": 1
                  },
                  {
                    "w": "inlet",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Why do people migrate?",
                "words": [
                  {
                    "w": "international migration",
                    "u": 1
                  },
                  {
                    "w": "border controls",
                    "u": 1
                  },
                  {
                    "w": "pull factors",
                    "u": 1
                  },
                  {
                    "w": "push factors",
                    "u": 1
                  },
                  {
                    "w": "voluntary",
                    "u": 1
                  },
                  {
                    "w": "siblings",
                    "u": 1
                  },
                  {
                    "w": "abandon",
                    "u": 2
                  },
                  {
                    "w": "forced",
                    "u": 1
                  },
                  {
                    "w": "involuntary",
                    "u": 1
                  },
                  {
                    "w": "commute",
                    "u": 1
                  },
                  {
                    "w": "enquiry",
                    "u": 1
                  },
                  {
                    "w": "internal migration",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Semra’s migration story",
                "words": [
                  {
                    "w": "emigrated",
                    "u": 1
                  },
                  {
                    "w": "adjust",
                    "u": 1
                  },
                  {
                    "w": "passport control",
                    "u": 1
                  },
                  {
                    "w": "check in",
                    "u": 1
                  },
                  {
                    "w": "enquiries",
                    "u": 1
                  },
                  {
                    "w": "immigrant",
                    "u": 1
                  },
                  {
                    "w": "self-reliant",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Refugees",
                "words": [
                  {
                    "w": "temporary",
                    "u": 1
                  },
                  {
                    "w": "United Nations High Commission for Refugees",
                    "u": 1
                  },
                  {
                    "w": "official",
                    "u": 1
                  },
                  {
                    "w": "refugees",
                    "u": 2
                  },
                  {
                    "w": "engulfing",
                    "u": 1
                  },
                  {
                    "w": "officially",
                    "u": 1
                  },
                  {
                    "w": "persecution",
                    "u": 3
                  },
                  {
                    "w": "flee",
                    "u": 1
                  },
                  {
                    "w": "permanent",
                    "u": 2
                  },
                  {
                    "w": "displaced",
                    "u": 1
                  },
                  {
                    "w": "asylum-seekers",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "How does migration change places??",
                "words": [
                  {
                    "w": "mechanisation",
                    "u": 1
                  },
                  {
                    "w": "demand",
                    "u": 2
                  },
                  {
                    "w": "expansion",
                    "u": 1
                  },
                  {
                    "w": "Fens",
                    "u": 1
                  },
                  {
                    "w": "family tree",
                    "u": 1
                  },
                  {
                    "w": "depopulation",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Does it matter where we live?",
                "words": [
                  {
                    "w": "belonging",
                    "u": 1
                  },
                  {
                    "w": "identity",
                    "u": 2
                  },
                  {
                    "w": "scale",
                    "u": 2
                  },
                  {
                    "w": "neighbourhood",
                    "u": 1
                  },
                  {
                    "w": "dual nationality",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "living-christian-traditions-5spring1",
            "title": "Living Christian traditions",
            "chapters": [
              {
                "n": 1,
                "title": "The oldest church in the world",
                "words": [
                  {
                    "w": "painstakingly",
                    "u": 1
                  },
                  {
                    "w": "contempt",
                    "u": 1
                  },
                  {
                    "w": "hymns",
                    "u": 1
                  },
                  {
                    "w": "Holy Land",
                    "u": 1
                  },
                  {
                    "w": "procession",
                    "u": 1
                  },
                  {
                    "w": "funeral",
                    "u": 1
                  },
                  {
                    "w": "disrespect",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Why do Christians talk so much about Jesus?",
                "words": [
                  {
                    "w": "representation",
                    "u": 1
                  },
                  {
                    "w": "penned",
                    "u": 1
                  },
                  {
                    "w": "profoundly",
                    "u": 1
                  },
                  {
                    "w": "perplexed",
                    "u": 2
                  },
                  {
                    "w": "approaching",
                    "u": 2
                  },
                  {
                    "w": "bore witness",
                    "u": 1
                  },
                  {
                    "w": "ranks",
                    "u": 2
                  },
                  {
                    "w": "stooped",
                    "u": 1
                  },
                  {
                    "w": "condescended",
                    "u": 1
                  },
                  {
                    "w": "begotten",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Christians love to sing and pray!",
                "words": [
                  {
                    "w": "reserved",
                    "u": 1
                  },
                  {
                    "w": "surmounted",
                    "u": 1
                  },
                  {
                    "w": "choir",
                    "u": 1
                  },
                  {
                    "w": "accompaniment",
                    "u": 1
                  },
                  {
                    "w": "ultimate",
                    "u": 1
                  },
                  {
                    "w": "contemplate",
                    "u": 1
                  },
                  {
                    "w": "contemplation",
                    "u": 1
                  },
                  {
                    "w": "intimate",
                    "u": 1
                  },
                  {
                    "w": "panels",
                    "u": 1
                  },
                  {
                    "w": "interceding",
                    "u": 1
                  },
                  {
                    "w": "intercedes",
                    "u": 1
                  },
                  {
                    "w": "visible",
                    "u": 2
                  },
                  {
                    "w": "saints",
                    "u": 1
                  },
                  {
                    "w": "patron saints",
                    "u": 1
                  },
                  {
                    "w": "fellow",
                    "u": 1
                  },
                  {
                    "w": "rosary",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "What is the greatest commandment of all?",
                "words": [
                  {
                    "w": "charred",
                    "u": 1
                  },
                  {
                    "w": "reconciliation",
                    "u": 1
                  },
                  {
                    "w": "encounter",
                    "u": 2
                  },
                  {
                    "w": "reconciled",
                    "u": 1
                  },
                  {
                    "w": "longing",
                    "u": 2
                  },
                  {
                    "w": "nun",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Christians create because God creates",
                "words": [
                  {
                    "w": "capacity",
                    "u": 1
                  },
                  {
                    "w": "luminous",
                    "u": 1
                  },
                  {
                    "w": "spires",
                    "u": 1
                  },
                  {
                    "w": "cruciform",
                    "u": 1
                  },
                  {
                    "w": "resembles",
                    "u": 1
                  },
                  {
                    "w": "cathedral",
                    "u": 3
                  },
                  {
                    "w": "sacrificial",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Christians serve Jesus by serving others",
                "words": [
                  {
                    "w": "rejected",
                    "u": 1
                  },
                  {
                    "w": "pastor",
                    "u": 1
                  },
                  {
                    "w": "vulnerable",
                    "u": 2
                  },
                  {
                    "w": "Son of Man",
                    "u": 1
                  },
                  {
                    "w": "imagery",
                    "u": 1
                  },
                  {
                    "w": "destitute",
                    "u": 1
                  },
                  {
                    "w": "shelters",
                    "u": 1
                  },
                  {
                    "w": "sanctuary",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "5",
      "term": "Spring2",
      "cols": {
        "History": [
          {
            "id": "norse-culture-5spring2",
            "title": "Norse culture",
            "chapters": [
              {
                "n": 1,
                "title": "Freydis and her courage",
                "words": [
                  {
                    "w": "saga",
                    "u": 1
                  },
                  {
                    "w": "war-cry",
                    "u": 1
                  },
                  {
                    "w": "locals",
                    "u": 1
                  },
                  {
                    "w": "lush",
                    "u": 2
                  },
                  {
                    "w": "encampment",
                    "u": 1
                  },
                  {
                    "w": "Vinland",
                    "u": 1
                  },
                  {
                    "w": "catapult",
                    "u": 1
                  },
                  {
                    "w": "heavily pregnant",
                    "u": 1
                  },
                  {
                    "w": "Norse",
                    "u": 1
                  },
                  {
                    "w": "imminent",
                    "u": 2
                  },
                  {
                    "w": "foreigners",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The saga of \u000bErik the Red",
                "words": [
                  {
                    "w": "Leif Erikson",
                    "u": 1
                  },
                  {
                    "w": "Skraeling",
                    "u": 1
                  },
                  {
                    "w": "seafaring",
                    "u": 1
                  },
                  {
                    "w": "fjords",
                    "u": 1
                  },
                  {
                    "w": "fjord",
                    "u": 1
                  },
                  {
                    "w": "Iceland",
                    "u": 1
                  },
                  {
                    "w": "exiled",
                    "u": 1
                  },
                  {
                    "w": "exile",
                    "u": 4
                  },
                  {
                    "w": "mysterious",
                    "u": 1
                  },
                  {
                    "w": "Greenland",
                    "u": 1
                  },
                  {
                    "w": "pelts",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The great tree and the gods",
                "words": [
                  {
                    "w": "Thor",
                    "u": 1
                  },
                  {
                    "w": "Ragnarok",
                    "u": 1
                  },
                  {
                    "w": "Yule",
                    "u": 1
                  },
                  {
                    "w": "runes",
                    "u": 1
                  },
                  {
                    "w": "eddas",
                    "u": 1
                  },
                  {
                    "w": "giants",
                    "u": 1
                  },
                  {
                    "w": "amulet",
                    "u": 1
                  },
                  {
                    "w": "trickster",
                    "u": 1
                  },
                  {
                    "w": "Loki",
                    "u": 1
                  },
                  {
                    "w": "Valkyries",
                    "u": 1
                  },
                  {
                    "w": "Odin",
                    "u": 1
                  },
                  {
                    "w": "Valhalla",
                    "u": 1
                  },
                  {
                    "w": "mead hall",
                    "u": 1
                  },
                  {
                    "w": "Asgard",
                    "u": 1
                  },
                  {
                    "w": "inspired",
                    "u": 3
                  },
                  {
                    "w": "myths",
                    "u": 1
                  },
                  {
                    "w": "Midgard",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The Norse travel on and on",
                "words": [
                  {
                    "w": "course",
                    "u": 2
                  },
                  {
                    "w": "pilot",
                    "u": 1
                  },
                  {
                    "w": "harbour",
                    "u": 2
                  },
                  {
                    "w": "stern",
                    "u": 1
                  },
                  {
                    "w": "manoeuvred",
                    "u": 1
                  },
                  {
                    "w": "portage",
                    "u": 1
                  },
                  {
                    "w": "portaging",
                    "u": 1
                  },
                  {
                    "w": "crew",
                    "u": 1
                  },
                  {
                    "w": "upended",
                    "u": 1
                  },
                  {
                    "w": "inland",
                    "u": 1
                  },
                  {
                    "w": "mast",
                    "u": 2
                  },
                  {
                    "w": "hoisted",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Beowulf, part one",
                "words": [
                  {
                    "w": "inevitable",
                    "u": 1
                  },
                  {
                    "w": "bare hands",
                    "u": 1
                  },
                  {
                    "w": "fists",
                    "u": 1
                  },
                  {
                    "w": "made ready",
                    "u": 1
                  },
                  {
                    "w": "plight",
                    "u": 1
                  },
                  {
                    "w": "Beowulf",
                    "u": 1
                  },
                  {
                    "w": "clasping",
                    "u": 1
                  },
                  {
                    "w": "good spirits",
                    "u": 1
                  },
                  {
                    "w": "moor",
                    "u": 1
                  },
                  {
                    "w": "Construction",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "Beowulf, part two",
                "words": [
                  {
                    "w": "fearsome",
                    "u": 1
                  },
                  {
                    "w": "revenge",
                    "u": 2
                  },
                  {
                    "w": "subjects",
                    "u": 2
                  },
                  {
                    "w": "lurking",
                    "u": 1
                  },
                  {
                    "w": "severed",
                    "u": 1
                  },
                  {
                    "w": "scoured",
                    "u": 1
                  },
                  {
                    "w": "distraught",
                    "u": 2
                  },
                  {
                    "w": "search party",
                    "u": 1
                  },
                  {
                    "w": "forged",
                    "u": 1
                  },
                  {
                    "w": "dragon",
                    "u": 1
                  },
                  {
                    "w": "slew",
                    "u": 1
                  },
                  {
                    "w": "fatal",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "north-south-america-5spring2",
            "title": "North South America",
            "chapters": [
              {
                "n": 2,
                "title": "What is a megacity?",
                "words": [
                  {
                    "w": "megacity",
                    "u": 1
                  },
                  {
                    "w": "sustain",
                    "u": 1
                  },
                  {
                    "w": "New York City",
                    "u": 1
                  },
                  {
                    "w": "natural disasters",
                    "u": 1
                  },
                  {
                    "w": "Lima",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The megacities of Brazil",
                "words": [
                  {
                    "w": "the Americas",
                    "u": 1
                  },
                  {
                    "w": "populous",
                    "u": 1
                  },
                  {
                    "w": "Rio de Janeiro",
                    "u": 1
                  },
                  {
                    "w": "Tropic of Capricorn",
                    "u": 1
                  },
                  {
                    "w": "São Paulo",
                    "u": 1
                  },
                  {
                    "w": "Brazil",
                    "u": 1
                  },
                  {
                    "w": "Christ the Redeemer",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Rural-to-urban",
                "words": [
                  {
                    "w": "four-figure grid reference",
                    "u": 1
                  },
                  {
                    "w": "eastings",
                    "u": 1
                  },
                  {
                    "w": "grid",
                    "u": 1
                  },
                  {
                    "w": "favelas",
                    "u": 1
                  },
                  {
                    "w": "locate",
                    "u": 1
                  },
                  {
                    "w": "Northings",
                    "u": 1
                  },
                  {
                    "w": "favela",
                    "u": 1
                  },
                  {
                    "w": "makeshift",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The favelas",
                "words": [
                  {
                    "w": "outskirts",
                    "u": 1
                  },
                  {
                    "w": "sewers",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Challenging the stereotype of the favela",
                "words": [
                  {
                    "w": "portrayed",
                    "u": 1
                  },
                  {
                    "w": "stereotypes",
                    "u": 1
                  },
                  {
                    "w": "favelado",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "5",
      "term": "Summer1",
      "cols": {
        "History": [
          {
            "id": "vikings-2-changing-rulers-5summer1",
            "title": "Vikings 2 Changing rulers",
            "chapters": [
              {
                "n": 1,
                "title": "Jorvik in 910: \u000bthree errands for Helga",
                "words": [
                  {
                    "w": "bellows",
                    "u": 1
                  },
                  {
                    "w": "cellars",
                    "u": 1
                  },
                  {
                    "w": "in tow",
                    "u": 1
                  },
                  {
                    "w": "Jorvik",
                    "u": 1
                  },
                  {
                    "w": "woodturner",
                    "u": 1
                  },
                  {
                    "w": "errands",
                    "u": 1
                  },
                  {
                    "w": "awl",
                    "u": 1
                  },
                  {
                    "w": "cobbler",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The warriors return to Jorvik",
                "words": [
                  {
                    "w": "thronging",
                    "u": 1
                  },
                  {
                    "w": "kinsman",
                    "u": 1
                  },
                  {
                    "w": "scours",
                    "u": 1
                  },
                  {
                    "w": "outrage",
                    "u": 1
                  },
                  {
                    "w": "idly",
                    "u": 1
                  },
                  {
                    "w": "chivvies",
                    "u": 1
                  },
                  {
                    "w": "loom",
                    "u": 1
                  },
                  {
                    "w": "sable",
                    "u": 1
                  },
                  {
                    "w": "vessel",
                    "u": 1
                  },
                  {
                    "w": "wharves",
                    "u": 1
                  },
                  {
                    "w": "detour",
                    "u": 1
                  },
                  {
                    "w": "pendants",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Different stories, missing stories",
                "words": [
                  {
                    "w": "fragments",
                    "u": 1
                  },
                  {
                    "w": "upheaval",
                    "u": 1
                  },
                  {
                    "w": "finds",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Aethelflaed presses north",
                "words": [
                  {
                    "w": "contemplated",
                    "u": 1
                  },
                  {
                    "w": "disgruntled",
                    "u": 1
                  },
                  {
                    "w": "laid to rest",
                    "u": 1
                  },
                  {
                    "w": "stronghold",
                    "u": 1
                  },
                  {
                    "w": "yielding",
                    "u": 1
                  },
                  {
                    "w": "taunt",
                    "u": 1
                  },
                  {
                    "w": "coordinating",
                    "u": 1
                  },
                  {
                    "w": "assault",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Athelstan’s England",
                "words": [
                  {
                    "w": "anoint",
                    "u": 1
                  },
                  {
                    "w": "circlets",
                    "u": 1
                  },
                  {
                    "w": "reverently",
                    "u": 2
                  },
                  {
                    "w": "coronation",
                    "u": 1
                  },
                  {
                    "w": "tribute",
                    "u": 1
                  },
                  {
                    "w": "sceptre",
                    "u": 1
                  },
                  {
                    "w": "consecration",
                    "u": 1
                  },
                  {
                    "w": "consecrated",
                    "u": 1
                  },
                  {
                    "w": "churned",
                    "u": 1
                  },
                  {
                    "w": "realms",
                    "u": 1
                  },
                  {
                    "w": "acclaim",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Vikings shaping Britain",
                "words": [
                  {
                    "w": "hogbacks",
                    "u": 1
                  },
                  {
                    "w": "unique",
                    "u": 3
                  },
                  {
                    "w": "courtiers",
                    "u": 1
                  },
                  {
                    "w": "rebuke",
                    "u": 1
                  },
                  {
                    "w": "pious",
                    "u": 1
                  },
                  {
                    "w": "consequence",
                    "u": 1
                  },
                  {
                    "w": "perpetual",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "amazon-5summer1",
            "title": "Amazon",
            "chapters": [
              {
                "n": 2,
                "title": "The Amazon river",
                "words": [
                  {
                    "w": "situated",
                    "u": 1
                  },
                  {
                    "w": "basin",
                    "u": 1
                  },
                  {
                    "w": "piranha",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The Amazon’s intricate ecosystem",
                "words": [
                  {
                    "w": "predators",
                    "u": 1
                  },
                  {
                    "w": "anteater",
                    "u": 1
                  },
                  {
                    "w": "termite",
                    "u": 1
                  },
                  {
                    "w": "food chain",
                    "u": 1
                  },
                  {
                    "w": "micro-organisms",
                    "u": 1
                  },
                  {
                    "w": "ecosystem",
                    "u": 1
                  },
                  {
                    "w": "interact",
                    "u": 1
                  },
                  {
                    "w": "canopy",
                    "u": 1
                  },
                  {
                    "w": "orchids",
                    "u": 1
                  },
                  {
                    "w": "emergents",
                    "u": 1
                  },
                  {
                    "w": "drenched",
                    "u": 1
                  },
                  {
                    "w": "humid",
                    "u": 2
                  },
                  {
                    "w": "habitat",
                    "u": 2
                  },
                  {
                    "w": "buttress",
                    "u": 1
                  },
                  {
                    "w": "camouflage",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "How does the ecosystem work?",
                "words": [
                  {
                    "w": "Compost",
                    "u": 1
                  },
                  {
                    "w": "carbon cycle",
                    "u": 1
                  },
                  {
                    "w": "decomposers",
                    "u": 1
                  },
                  {
                    "w": "Interactions",
                    "u": 1
                  },
                  {
                    "w": "nutrients",
                    "u": 2
                  },
                  {
                    "w": "nutrient cycle",
                    "u": 1
                  },
                  {
                    "w": "decomposition",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Changes in the ecosystem",
                "words": [
                  {
                    "w": "companies",
                    "u": 1
                  },
                  {
                    "w": "deforested",
                    "u": 1
                  },
                  {
                    "w": "ranching",
                    "u": 1
                  },
                  {
                    "w": "deforestation",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Should things change in the Amazon?",
                "words": [
                  {
                    "w": "Yanomami",
                    "u": 1
                  },
                  {
                    "w": "conflict",
                    "u": 1
                  },
                  {
                    "w": "power",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "buddhism-1-5summer1",
            "title": "Buddhism 1",
            "chapters": [
              {
                "n": 1,
                "title": "The prince in the palace",
                "words": [
                  {
                    "w": "sage",
                    "u": 1
                  },
                  {
                    "w": "injured",
                    "u": 1
                  },
                  {
                    "w": "destined",
                    "u": 1
                  },
                  {
                    "w": "Siddhartha Gautama",
                    "u": 1
                  },
                  {
                    "w": "Buddhists",
                    "u": 1
                  },
                  {
                    "w": "ventured",
                    "u": 1
                  },
                  {
                    "w": "stabled",
                    "u": 1
                  },
                  {
                    "w": "pruned",
                    "u": 1
                  },
                  {
                    "w": "confines",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The three great sights",
                "words": [
                  {
                    "w": "convulsed",
                    "u": 1
                  },
                  {
                    "w": "wracked",
                    "u": 1
                  },
                  {
                    "w": "privileged",
                    "u": 1
                  },
                  {
                    "w": "mourning",
                    "u": 1
                  },
                  {
                    "w": "hobbled",
                    "u": 1
                  },
                  {
                    "w": "dodder",
                    "u": 1
                  },
                  {
                    "w": "agony",
                    "u": 1
                  },
                  {
                    "w": "pursed",
                    "u": 1
                  },
                  {
                    "w": "Writhing",
                    "u": 1
                  },
                  {
                    "w": "mourners",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The prince’s great quest",
                "words": [
                  {
                    "w": "hollered",
                    "u": 1
                  },
                  {
                    "w": "forgo",
                    "u": 1
                  },
                  {
                    "w": "haggling",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Sitting under the fig tree",
                "words": [
                  {
                    "w": "xtreme",
                    "u": 1
                  },
                  {
                    "w": "manifested",
                    "u": 1
                  },
                  {
                    "w": "pitted",
                    "u": 1
                  },
                  {
                    "w": "pampered",
                    "u": 1
                  },
                  {
                    "w": "obscured",
                    "u": 1
                  },
                  {
                    "w": "ego",
                    "u": 1
                  },
                  {
                    "w": "a middle way",
                    "u": 1
                  },
                  {
                    "w": "Mara",
                    "u": 1
                  },
                  {
                    "w": "demonic",
                    "u": 1
                  },
                  {
                    "w": "hideous",
                    "u": 1
                  },
                  {
                    "w": "contorted",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Becoming the Buddha",
                "words": [
                  {
                    "w": "enlightened",
                    "u": 1
                  },
                  {
                    "w": "awakened",
                    "u": 1
                  },
                  {
                    "w": "bodhi tree",
                    "u": 1
                  },
                  {
                    "w": "uddha",
                    "u": 1
                  },
                  {
                    "w": "Gautama Buddha",
                    "u": 1
                  },
                  {
                    "w": "blossoms",
                    "u": 1
                  },
                  {
                    "w": "Buddhism",
                    "u": 1
                  },
                  {
                    "w": "lotus position",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The never-ending cycle",
                "words": [
                  {
                    "w": "past lives",
                    "u": 1
                  },
                  {
                    "w": "former",
                    "u": 1
                  },
                  {
                    "w": "sangha",
                    "u": 1
                  },
                  {
                    "w": "rickety",
                    "u": 1
                  },
                  {
                    "w": "propped",
                    "u": 1
                  },
                  {
                    "w": "dictate",
                    "u": 1
                  },
                  {
                    "w": "Tibetan",
                    "u": 1
                  },
                  {
                    "w": "enduring",
                    "u": 1
                  },
                  {
                    "w": "enlightenment",
                    "u": 1
                  },
                  {
                    "w": "samsara",
                    "u": 1
                  }
                ]
              }
            ]
          },
          {
            "id": "buddhism-2-5summer1",
            "title": "Buddhism 2",
            "chapters": [
              {
                "n": 1,
                "title": "The story of the mustard seeds",
                "words": [
                  {
                    "w": "spare",
                    "u": 2
                  },
                  {
                    "w": "forlorn",
                    "u": 1
                  },
                  {
                    "w": "distraught",
                    "u": 2
                  },
                  {
                    "w": "Lord Buddha",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The wheel keeps turning",
                "words": [
                  {
                    "w": "Four Noble Truths",
                    "u": 1
                  },
                  {
                    "w": "permanent",
                    "u": 2
                  },
                  {
                    "w": "cravings",
                    "u": 1
                  },
                  {
                    "w": "grasp",
                    "u": 1
                  },
                  {
                    "w": "cease",
                    "u": 1
                  },
                  {
                    "w": "seemingly",
                    "u": 1
                  },
                  {
                    "w": "nirvana",
                    "u": 1
                  },
                  {
                    "w": "expelled",
                    "u": 2
                  },
                  {
                    "w": "unavoidable",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Following the path",
                "words": [
                  {
                    "w": "spokes",
                    "u": 1
                  },
                  {
                    "w": "indirectly",
                    "u": 1
                  },
                  {
                    "w": "mindfulness",
                    "u": 1
                  },
                  {
                    "w": "dharma wheel",
                    "u": 1
                  },
                  {
                    "w": "Eightfold Path",
                    "u": 1
                  },
                  {
                    "w": "mango",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Right speech –",
                "words": [
                  {
                    "w": "exaggerating",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Right actions –",
                "words": [
                  {
                    "w": "karma",
                    "u": 1
                  },
                  {
                    "w": "regret",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The law of karma",
                "words": [
                  {
                    "w": "vihara",
                    "u": 1
                  },
                  {
                    "w": "donned",
                    "u": 1
                  },
                  {
                    "w": "menacing",
                    "u": 1
                  },
                  {
                    "w": "gloated",
                    "u": 1
                  },
                  {
                    "w": "countenance",
                    "u": 1
                  },
                  {
                    "w": "brigand",
                    "u": 1
                  },
                  {
                    "w": "brandishing",
                    "u": 1
                  },
                  {
                    "w": "saffron",
                    "u": 1
                  }
                ]
              },
              {
                "n": 0,
                "title": "5",
                "words": [
                  {
                    "w": "consciously",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Buddha’s hands",
                "words": [
                  {
                    "w": "forefinger",
                    "u": 1
                  },
                  {
                    "w": "reclined",
                    "u": 1
                  },
                  {
                    "w": "senses",
                    "u": 1
                  },
                  {
                    "w": "consciousness",
                    "u": 1
                  },
                  {
                    "w": "attained",
                    "u": 1
                  },
                  {
                    "w": "petition",
                    "u": 2
                  },
                  {
                    "w": "emulate",
                    "u": 1
                  },
                  {
                    "w": "mudras",
                    "u": 1
                  },
                  {
                    "w": "mudra",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "It’s time to celebrate!",
                "words": [
                  {
                    "w": "Vesak Day",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "It’s time to celebrate!",
                "words": [
                  {
                    "w": "Devotees",
                    "u": 1
                  },
                  {
                    "w": "relinquished",
                    "u": 1
                  },
                  {
                    "w": "pearl white",
                    "u": 1
                  },
                  {
                    "w": "wither",
                    "u": 1
                  },
                  {
                    "w": "fleeting",
                    "u": 1
                  },
                  {
                    "w": "stupa",
                    "u": 1
                  },
                  {
                    "w": "prayer flags",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "5",
      "term": "Summer2",
      "cols": {
        "Geography": [
          {
            "id": "interconnected-amazon-5summer2",
            "title": "Interconnected Amazon",
            "chapters": [
              {
                "n": 1,
                "title": "What is it like to farm in the Amazon?",
                "words": [
                  {
                    "w": "subsistence",
                    "u": 1
                  },
                  {
                    "w": "commercial",
                    "u": 1
                  },
                  {
                    "w": "scale",
                    "u": 2
                  },
                  {
                    "w": "Ayore",
                    "u": 1
                  },
                  {
                    "w": "dye",
                    "u": 1
                  },
                  {
                    "w": "garabatá",
                    "u": 1
                  },
                  {
                    "w": "mass produce",
                    "u": 1
                  },
                  {
                    "w": "fibre",
                    "u": 1
                  },
                  {
                    "w": "clearing",
                    "u": 1
                  },
                  {
                    "w": "products",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The journey of soy",
                "words": [
                  {
                    "w": "secondary",
                    "u": 1
                  },
                  {
                    "w": "raw materials",
                    "u": 1
                  },
                  {
                    "w": "interconnected",
                    "u": 1
                  },
                  {
                    "w": "tertiary",
                    "u": 1
                  },
                  {
                    "w": "profit",
                    "u": 1
                  },
                  {
                    "w": "wholesalers",
                    "u": 1
                  },
                  {
                    "w": "primary",
                    "u": 1
                  },
                  {
                    "w": "manufacturing",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Trading connections",
                "words": [
                  {
                    "w": "cattle",
                    "u": 2
                  },
                  {
                    "w": "supply",
                    "u": 1
                  },
                  {
                    "w": "colonised",
                    "u": 1
                  },
                  {
                    "w": "trans-national companies",
                    "u": 1
                  },
                  {
                    "w": "adequate",
                    "u": 1
                  },
                  {
                    "w": "demand",
                    "u": 2
                  },
                  {
                    "w": "recent",
                    "u": 1
                  },
                  {
                    "w": "brands",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Environmental connections",
                "words": [
                  {
                    "w": "flow diagrams",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Social connections",
                "words": [
                  {
                    "w": "social",
                    "u": 1
                  },
                  {
                    "w": "globalisation",
                    "u": 1
                  },
                  {
                    "w": "culture",
                    "u": 2
                  }
                ]
              },
              {
                "n": 6,
                "title": "How does our class connect to the Amazon?",
                "words": [
                  {
                    "w": "interconnection",
                    "u": 1
                  },
                  {
                    "w": "geographical enquiry",
                    "u": 1
                  },
                  {
                    "w": "findings",
                    "u": 1
                  },
                  {
                    "w": "questionnaire",
                    "u": 1
                  },
                  {
                    "w": "analyse",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "sikhism-1-5summer2",
            "title": "Sikhism 1",
            "chapters": [
              {
                "n": 1,
                "title": "The first guru",
                "words": [
                  {
                    "w": "revere",
                    "u": 1
                  },
                  {
                    "w": "snow-capped",
                    "u": 1
                  },
                  {
                    "w": "worldwide",
                    "u": 1
                  },
                  {
                    "w": "guru",
                    "u": 1
                  },
                  {
                    "w": "regal",
                    "u": 1
                  },
                  {
                    "w": "Sikhs",
                    "u": 1
                  },
                  {
                    "w": "Nanak",
                    "u": 1
                  },
                  {
                    "w": "cremated",
                    "u": 1
                  },
                  {
                    "w": "imminent",
                    "u": 2
                  },
                  {
                    "w": "shroud",
                    "u": 1
                  },
                  {
                    "w": "Guru Nanak",
                    "u": 1
                  },
                  {
                    "w": "PUNJAB",
                    "u": 1
                  },
                  {
                    "w": "Punjabi",
                    "u": 1
                  },
                  {
                    "w": "cobra",
                    "u": 1
                  },
                  {
                    "w": "trance",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Blood and milk",
                "words": [
                  {
                    "w": "bristled",
                    "u": 1
                  },
                  {
                    "w": "Ji",
                    "u": 1
                  },
                  {
                    "w": "hospitality",
                    "u": 2
                  },
                  {
                    "w": "chapatis",
                    "u": 1
                  },
                  {
                    "w": "utter",
                    "u": 1
                  },
                  {
                    "w": "dredged",
                    "u": 1
                  },
                  {
                    "w": "profound",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Four long journeys",
                "words": [
                  {
                    "w": "oneness",
                    "u": 1
                  },
                  {
                    "w": "udasi",
                    "u": 1
                  },
                  {
                    "w": "devout",
                    "u": 1
                  },
                  {
                    "w": "naïve",
                    "u": 1
                  },
                  {
                    "w": "maintain",
                    "u": 1
                  },
                  {
                    "w": "udasis",
                    "u": 1
                  },
                  {
                    "w": "category",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Come, let us eat together.",
                "words": [
                  {
                    "w": "common meal",
                    "u": 1
                  },
                  {
                    "w": "heed",
                    "u": 1
                  },
                  {
                    "w": "rendered",
                    "u": 1
                  },
                  {
                    "w": "ik onkar",
                    "u": 1
                  },
                  {
                    "w": "acres",
                    "u": 1
                  },
                  {
                    "w": "insisted",
                    "u": 1
                  },
                  {
                    "w": "langar",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Sugar, water and lions!",
                "words": [
                  {
                    "w": "invocation",
                    "u": 1
                  },
                  {
                    "w": "royalty",
                    "u": 1
                  },
                  {
                    "w": "nectar",
                    "u": 1
                  },
                  {
                    "w": "timid",
                    "u": 1
                  },
                  {
                    "w": "extinguished",
                    "u": 1
                  },
                  {
                    "w": "infused",
                    "u": 1
                  },
                  {
                    "w": "amrit",
                    "u": 1
                  },
                  {
                    "w": "Singh",
                    "u": 1
                  },
                  {
                    "w": "Guru Gobind Singh",
                    "u": 1
                  },
                  {
                    "w": "exquisite",
                    "u": 1
                  },
                  {
                    "w": "Khalsa",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The eternal guru",
                "words": [
                  {
                    "w": "stringed",
                    "u": 1
                  },
                  {
                    "w": "Guru Granth Sahib",
                    "u": 1
                  },
                  {
                    "w": "overshadowed",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "6",
      "term": "Autumn1",
      "cols": {
        "History": [
          {
            "id": "the-maya-6autumn1",
            "title": "The Maya",
            "chapters": [
              {
                "n": 1,
                "title": "The blood of the queen",
                "words": [
                  {
                    "w": "aligned",
                    "u": 1
                  },
                  {
                    "w": "potent",
                    "u": 1
                  },
                  {
                    "w": "founder",
                    "u": 1
                  },
                  {
                    "w": "hallucination",
                    "u": 1
                  },
                  {
                    "w": "hallucinating",
                    "u": 1
                  },
                  {
                    "w": "acceding",
                    "u": 1
                  },
                  {
                    "w": "bloodletting",
                    "u": 1
                  },
                  {
                    "w": "shard",
                    "u": 1
                  },
                  {
                    "w": "accession",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Let’s meet the Maya",
                "words": [
                  {
                    "w": "texts",
                    "u": 1
                  },
                  {
                    "w": "Mesoamerica",
                    "u": 1
                  },
                  {
                    "w": "Maya",
                    "u": 1
                  },
                  {
                    "w": "precise",
                    "u": 1
                  },
                  {
                    "w": "Mayan",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The city of the",
                "words": [
                  {
                    "w": "stelae",
                    "u": 1
                  },
                  {
                    "w": "adorned",
                    "u": 1
                  },
                  {
                    "w": "turmoil",
                    "u": 1
                  },
                  {
                    "w": "plaza",
                    "u": 1
                  },
                  {
                    "w": "temple-pyramid",
                    "u": 1
                  },
                  {
                    "w": "flagstones",
                    "u": 1
                  },
                  {
                    "w": "Pakal",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Chocolate: the food of the gods",
                "words": [
                  {
                    "w": "fashioned",
                    "u": 1
                  },
                  {
                    "w": "delicacy",
                    "u": 2
                  },
                  {
                    "w": "godliest",
                    "u": 1
                  },
                  {
                    "w": "maize",
                    "u": 1
                  },
                  {
                    "w": "roasted",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Maya loved maths!",
                "words": [
                  {
                    "w": "primordial",
                    "u": 1
                  },
                  {
                    "w": "solar calendar",
                    "u": 1
                  },
                  {
                    "w": "obsidian",
                    "u": 1
                  },
                  {
                    "w": "Long Count",
                    "u": 1
                  },
                  {
                    "w": "shaman",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "What happened to the Maya?",
                "words": [
                  {
                    "w": "Chichen Itza",
                    "u": 1
                  },
                  {
                    "w": "collapse",
                    "u": 1
                  },
                  {
                    "w": "abandoned",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "energy-and-climate-change-6autumn1",
            "title": "Energy and climate change",
            "chapters": [
              {
                "n": 1,
                "title": "What is the energy mix in the United Kingdom?",
                "words": [
                  {
                    "w": "biofuel",
                    "u": 1
                  },
                  {
                    "w": "generate",
                    "u": 1
                  },
                  {
                    "w": "energy mix",
                    "u": 1
                  },
                  {
                    "w": "emissions",
                    "u": 1
                  },
                  {
                    "w": "net zero",
                    "u": 1
                  },
                  {
                    "w": "renewable",
                    "u": 1
                  },
                  {
                    "w": "non-renewable",
                    "u": 1
                  },
                  {
                    "w": "tidal power",
                    "u": 1
                  },
                  {
                    "w": "solar power",
                    "u": 1
                  },
                  {
                    "w": "geothermal power",
                    "u": 1
                  },
                  {
                    "w": "solar panels",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Forming opinions \u000babout onshore wind power",
                "words": [
                  {
                    "w": "national grid",
                    "u": 1
                  },
                  {
                    "w": "justify",
                    "u": 1
                  },
                  {
                    "w": "priorities",
                    "u": 1
                  },
                  {
                    "w": "offshore",
                    "u": 1
                  },
                  {
                    "w": "opinion",
                    "u": 1
                  },
                  {
                    "w": "visual pollution",
                    "u": 1
                  },
                  {
                    "w": "controversial",
                    "u": 1
                  },
                  {
                    "w": "planning permission",
                    "u": 1
                  },
                  {
                    "w": "onshore",
                    "u": 1
                  },
                  {
                    "w": "electricity pylons",
                    "u": 1
                  },
                  {
                    "w": "grind",
                    "u": 1
                  },
                  {
                    "w": "prevailing",
                    "u": 1
                  },
                  {
                    "w": "knot",
                    "u": 1
                  },
                  {
                    "w": "potential",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Forming opinions about onshore wind power",
                "words": [
                  {
                    "w": "Costs and benefits",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Forming opinions about nuclear power",
                "words": [
                  {
                    "w": "reasoned",
                    "u": 1
                  },
                  {
                    "w": "atomic",
                    "u": 1
                  },
                  {
                    "w": "access",
                    "u": 1
                  },
                  {
                    "w": "reactor",
                    "u": 1
                  },
                  {
                    "w": "uranium",
                    "u": 1
                  },
                  {
                    "w": "controversy",
                    "u": 1
                  },
                  {
                    "w": "byproduct",
                    "u": 1
                  },
                  {
                    "w": "reactors",
                    "u": 1
                  },
                  {
                    "w": "High Court",
                    "u": 1
                  },
                  {
                    "w": "radioactivity",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "What are the causes of climate change?",
                "words": [
                  {
                    "w": "flourish",
                    "u": 1
                  },
                  {
                    "w": "methane",
                    "u": 1
                  },
                  {
                    "w": "implement",
                    "u": 1
                  },
                  {
                    "w": "Paris Agreement",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "What are the effects of climate change?",
                "words": [
                  {
                    "w": "meltwater",
                    "u": 1
                  },
                  {
                    "w": "acidification",
                    "u": 1
                  },
                  {
                    "w": "wildfires",
                    "u": 1
                  },
                  {
                    "w": "conserve",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "What can we do about climate change?",
                "words": [
                  {
                    "w": "saplings",
                    "u": 1
                  },
                  {
                    "w": "heat pumps",
                    "u": 1
                  },
                  {
                    "w": "insulation",
                    "u": 1
                  },
                  {
                    "w": "Sustainable Development Goals",
                    "u": 1
                  },
                  {
                    "w": "Intergovernmental Panel on Climate Change",
                    "u": 1
                  },
                  {
                    "w": "afforestation",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "6",
      "term": "Autumn2",
      "cols": {
        "History": [
          {
            "id": "ethiopia-and-benin-6autumn2",
            "title": "Ethiopia and Benin",
            "chapters": [
              {
                "n": 1,
                "title": "An old empire falls;\u000ba new empire rises",
                "words": [
                  {
                    "w": "befell",
                    "u": 1
                  },
                  {
                    "w": "spectacular",
                    "u": 1
                  },
                  {
                    "w": "transform",
                    "u": 1
                  },
                  {
                    "w": "millet",
                    "u": 1
                  },
                  {
                    "w": "felled",
                    "u": 1
                  },
                  {
                    "w": "quarries",
                    "u": 1
                  },
                  {
                    "w": "overthrown",
                    "u": 1
                  },
                  {
                    "w": "Solomonic",
                    "u": 1
                  },
                  {
                    "w": "appointed",
                    "u": 3
                  }
                ]
              },
              {
                "n": 2,
                "title": "Do not search for another king!",
                "words": [
                  {
                    "w": "furtively",
                    "u": 1
                  },
                  {
                    "w": "banquet",
                    "u": 1
                  },
                  {
                    "w": "lavish",
                    "u": 1
                  },
                  {
                    "w": "Zara Yaqob",
                    "u": 1
                  },
                  {
                    "w": "entreaty",
                    "u": 1
                  },
                  {
                    "w": "tonsured",
                    "u": 1
                  },
                  {
                    "w": "hides",
                    "u": 1
                  },
                  {
                    "w": "heartfelt",
                    "u": 1
                  },
                  {
                    "w": "tendons",
                    "u": 1
                  },
                  {
                    "w": "feverish",
                    "u": 1
                  },
                  {
                    "w": "hierarchy",
                    "u": 1
                  },
                  {
                    "w": "rations",
                    "u": 1
                  },
                  {
                    "w": "a hive of activity",
                    "u": 1
                  },
                  {
                    "w": "forefathers",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The trappings of power",
                "words": [
                  {
                    "w": "psalter",
                    "u": 1
                  },
                  {
                    "w": "trappings of power",
                    "u": 1
                  },
                  {
                    "w": "medieval",
                    "u": 1
                  },
                  {
                    "w": "parasol",
                    "u": 1
                  },
                  {
                    "w": "miniature",
                    "u": 1
                  },
                  {
                    "w": "psalms",
                    "u": 1
                  },
                  {
                    "w": "relics",
                    "u": 1
                  },
                  {
                    "w": "brocade",
                    "u": 1
                  },
                  {
                    "w": "ambassadors",
                    "u": 1
                  },
                  {
                    "w": "Christendom",
                    "u": 1
                  },
                  {
                    "w": "numerous",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "A rainforest kingdom",
                "words": [
                  {
                    "w": "virtues",
                    "u": 1
                  },
                  {
                    "w": "oral traditions",
                    "u": 1
                  },
                  {
                    "w": "maze",
                    "u": 1
                  },
                  {
                    "w": "navigate",
                    "u": 1
                  },
                  {
                    "w": "exploiting",
                    "u": 1
                  },
                  {
                    "w": "smelt",
                    "u": 1
                  },
                  {
                    "w": "okra",
                    "u": 1
                  },
                  {
                    "w": "iron ore",
                    "u": 1
                  },
                  {
                    "w": "smelting",
                    "u": 1
                  },
                  {
                    "w": "Ile-Ife",
                    "u": 1
                  },
                  {
                    "w": "creeks",
                    "u": 1
                  },
                  {
                    "w": "canoes",
                    "u": 1
                  },
                  {
                    "w": "deftly",
                    "u": 1
                  },
                  {
                    "w": "reclaim",
                    "u": 1
                  },
                  {
                    "w": "hesitant",
                    "u": 1
                  },
                  {
                    "w": "pangolins",
                    "u": 1
                  },
                  {
                    "w": "Edo",
                    "u": 1
                  },
                  {
                    "w": "intricately",
                    "u": 1
                  },
                  {
                    "w": "Hornbills",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Leopard of the House",
                "words": [
                  {
                    "w": "urret",
                    "u": 1
                  },
                  {
                    "w": "spectacle",
                    "u": 1
                  },
                  {
                    "w": "gallery",
                    "u": 1
                  },
                  {
                    "w": "perch",
                    "u": 1
                  },
                  {
                    "w": "resemble",
                    "u": 1
                  },
                  {
                    "w": "gaping",
                    "u": 1
                  },
                  {
                    "w": "protruding",
                    "u": 1
                  },
                  {
                    "w": "guilds",
                    "u": 1
                  },
                  {
                    "w": "society",
                    "u": 1
                  },
                  {
                    "w": "mystical",
                    "u": 1
                  },
                  {
                    "w": "coral",
                    "u": 1
                  },
                  {
                    "w": "earthly",
                    "u": 1
                  },
                  {
                    "w": "Uzama",
                    "u": 1
                  },
                  {
                    "w": "superior",
                    "u": 1
                  },
                  {
                    "w": "ceremonial",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Rules, rituals and regalia",
                "words": [
                  {
                    "w": "Regalia",
                    "u": 1
                  },
                  {
                    "w": "apprentices",
                    "u": 1
                  },
                  {
                    "w": "Igue",
                    "u": 1
                  },
                  {
                    "w": "responsible",
                    "u": 1
                  },
                  {
                    "w": "artisans",
                    "u": 1
                  },
                  {
                    "w": "gong",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "ethiopia-6autumn2",
            "title": "Ethiopia",
            "chapters": [
              {
                "n": 1,
                "title": "Diverse Ethiopia",
                "words": [
                  {
                    "w": "Eritrea",
                    "u": 1
                  },
                  {
                    "w": "Great Rift Valley",
                    "u": 1
                  },
                  {
                    "w": "contemporary",
                    "u": 1
                  },
                  {
                    "w": "rift valley",
                    "u": 1
                  },
                  {
                    "w": "relief",
                    "u": 2
                  },
                  {
                    "w": "employment structure",
                    "u": 1
                  },
                  {
                    "w": "workforce",
                    "u": 1
                  },
                  {
                    "w": "teff",
                    "u": 1
                  },
                  {
                    "w": "time zone",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "What is it like to live in Ethiopia now?",
                "words": [
                  {
                    "w": "variations",
                    "u": 1
                  },
                  {
                    "w": "relative position",
                    "u": 1
                  },
                  {
                    "w": "diversity",
                    "u": 1
                  },
                  {
                    "w": "representative",
                    "u": 2
                  },
                  {
                    "w": "latrine",
                    "u": 1
                  },
                  {
                    "w": "relationship",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Some challenges in Ethiopia",
                "words": [
                  {
                    "w": "charcoal",
                    "u": 1
                  },
                  {
                    "w": "environmentally-friendly",
                    "u": 1
                  },
                  {
                    "w": "Water-borne",
                    "u": 1
                  },
                  {
                    "w": "terrorist",
                    "u": 1
                  },
                  {
                    "w": "underrepresented",
                    "u": 1
                  },
                  {
                    "w": "Ethiopia",
                    "u": 2
                  },
                  {
                    "w": "sanitation",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Biomes and agriculture in Ethiopia",
                "words": [
                  {
                    "w": "overhangs",
                    "u": 1
                  },
                  {
                    "w": "oxen",
                    "u": 2
                  },
                  {
                    "w": "bunds",
                    "u": 1
                  },
                  {
                    "w": "Tropics",
                    "u": 1
                  },
                  {
                    "w": "over-grazing",
                    "u": 1
                  },
                  {
                    "w": "semi-arid",
                    "u": 2
                  },
                  {
                    "w": "relatively",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Energy: is hydro-electric power the answer?",
                "words": [
                  {
                    "w": "indisputably",
                    "u": 1
                  },
                  {
                    "w": "at full capacity",
                    "u": 1
                  },
                  {
                    "w": "Sudan",
                    "u": 1
                  },
                  {
                    "w": "feat",
                    "u": 1
                  },
                  {
                    "w": "radiate",
                    "u": 1
                  },
                  {
                    "w": "Khartoum",
                    "u": 1
                  },
                  {
                    "w": "water  tower",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Climate change in Ethiopia",
                "words": [
                  {
                    "w": "food insecurity",
                    "u": 1
                  },
                  {
                    "w": "sewerage",
                    "u": 1
                  },
                  {
                    "w": "evergreen",
                    "u": 1
                  },
                  {
                    "w": "primate",
                    "u": 1
                  },
                  {
                    "w": "marginal",
                    "u": 1
                  },
                  {
                    "w": "habitable",
                    "u": 1
                  },
                  {
                    "w": "committed",
                    "u": 1
                  },
                  {
                    "w": "commitment",
                    "u": 1
                  },
                  {
                    "w": "projected",
                    "u": 1
                  },
                  {
                    "w": "informal",
                    "u": 1
                  },
                  {
                    "w": "impervious",
                    "u": 1
                  },
                  {
                    "w": "floodplain",
                    "u": 1
                  },
                  {
                    "w": "substantial",
                    "u": 1
                  },
                  {
                    "w": "malaria",
                    "u": 1
                  },
                  {
                    "w": "sustained",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "living-sikh-traditions-6autumn2",
            "title": "Living Sikh traditions",
            "chapters": [
              {
                "n": 1,
                "title": "The home of the Guru",
                "words": [
                  {
                    "w": "morsel",
                    "u": 1
                  },
                  {
                    "w": "emptyhanded",
                    "u": 1
                  },
                  {
                    "w": "parshad",
                    "u": 1
                  },
                  {
                    "w": "gurdwara",
                    "u": 1
                  },
                  {
                    "w": "Sikhi",
                    "u": 1
                  },
                  {
                    "w": "Waheguru",
                    "u": 1
                  },
                  {
                    "w": "bring to mind",
                    "u": 1
                  },
                  {
                    "w": "remembrance",
                    "u": 1
                  },
                  {
                    "w": "relishes",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "The first martyr \u000band his Golden Temple",
                "words": [
                  {
                    "w": "affairs",
                    "u": 1
                  },
                  {
                    "w": "fumed",
                    "u": 1
                  },
                  {
                    "w": "summons",
                    "u": 1
                  },
                  {
                    "w": "Lahore",
                    "u": 1
                  },
                  {
                    "w": "Seizing his chance",
                    "u": 1
                  },
                  {
                    "w": "sly",
                    "u": 1
                  },
                  {
                    "w": "Amritsar",
                    "u": 1
                  },
                  {
                    "w": "relay",
                    "u": 1
                  },
                  {
                    "w": "last words",
                    "u": 1
                  },
                  {
                    "w": "waver",
                    "u": 1
                  },
                  {
                    "w": "unwavering",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "All this needed to be done in jail for 40 days.",
                "words": [
                  {
                    "w": "implored",
                    "u": 1
                  },
                  {
                    "w": "Simran",
                    "u": 1
                  },
                  {
                    "w": "Seva",
                    "u": 1
                  },
                  {
                    "w": "superstitious",
                    "u": 1
                  },
                  {
                    "w": "liberated",
                    "u": 1
                  },
                  {
                    "w": "liberate",
                    "u": 1
                  },
                  {
                    "w": "tassels",
                    "u": 1
                  },
                  {
                    "w": "unique",
                    "u": 3
                  },
                  {
                    "w": "dilemma",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "The Guru frees the prisoners",
                "words": [
                  {
                    "w": "Guru Hargobind",
                    "u": 1
                  },
                  {
                    "w": "Bandi Chhor Divas",
                    "u": 1
                  },
                  {
                    "w": "cursed",
                    "u": 1
                  },
                  {
                    "w": "curse",
                    "u": 1
                  },
                  {
                    "w": "Bandi Chhor",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Kiran’s Sikh story",
                "words": [
                  {
                    "w": "kesh",
                    "u": 1
                  },
                  {
                    "w": "topknot",
                    "u": 1
                  },
                  {
                    "w": "kara",
                    "u": 1
                  },
                  {
                    "w": "Exceptional",
                    "u": 1
                  },
                  {
                    "w": "solace",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Kiran becomes Khalsa",
                "words": [
                  {
                    "w": "unsheaths",
                    "u": 1
                  },
                  {
                    "w": "sheath",
                    "u": 1
                  },
                  {
                    "w": "kachera",
                    "u": 1
                  },
                  {
                    "w": "kanga",
                    "u": 1
                  },
                  {
                    "w": "kirpan",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Kiran learns to read the Guru",
                "words": [
                  {
                    "w": "compiled",
                    "u": 1
                  },
                  {
                    "w": "likeness",
                    "u": 1
                  },
                  {
                    "w": "compilation",
                    "u": 1
                  },
                  {
                    "w": "prescribed",
                    "u": 2
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "6",
      "term": "Spring1",
      "cols": {
        "History": [
          {
            "id": "cities-in-time-manchester-man-6spring1",
            "title": "Cities in time Manchester Man",
            "chapters": [
              {
                "n": 1,
                "title": "Spring 1819 – Abel's journey",
                "words": [
                  {
                    "w": "Abel Heywood",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "Spring 1819 – Abel’s journey",
                "words": [
                  {
                    "w": "odours",
                    "u": 1
                  },
                  {
                    "w": "Sunday School",
                    "u": 1
                  },
                  {
                    "w": "incremental",
                    "u": 1
                  },
                  {
                    "w": "Manchester",
                    "u": 1
                  },
                  {
                    "w": "lodgings",
                    "u": 1
                  },
                  {
                    "w": "meagre",
                    "u": 1
                  },
                  {
                    "w": "expanse",
                    "u": 1
                  },
                  {
                    "w": "lately",
                    "u": 1
                  },
                  {
                    "w": "steeples",
                    "u": 1
                  },
                  {
                    "w": "foundry",
                    "u": 1
                  },
                  {
                    "w": "brewery",
                    "u": 1
                  },
                  {
                    "w": "dyeworks",
                    "u": 1
                  },
                  {
                    "w": "mill",
                    "u": 1
                  },
                  {
                    "w": "scuttling",
                    "u": 1
                  },
                  {
                    "w": "labyrinth",
                    "u": 1
                  },
                  {
                    "w": "scavenged",
                    "u": 1
                  },
                  {
                    "w": "slum",
                    "u": 1
                  },
                  {
                    "w": "yearning",
                    "u": 1
                  },
                  {
                    "w": "notorious",
                    "u": 1
                  },
                  {
                    "w": "endured",
                    "u": 1
                  },
                  {
                    "w": "abject",
                    "u": 1
                  },
                  {
                    "w": "strove",
                    "u": 1
                  },
                  {
                    "w": "horizon",
                    "u": 2
                  }
                ]
              },
              {
                "n": 2,
                "title": "Weaving worlds",
                "words": [
                  {
                    "w": "humid",
                    "u": 2
                  },
                  {
                    "w": "ceasing",
                    "u": 1
                  },
                  {
                    "w": "spinning jenny",
                    "u": 1
                  },
                  {
                    "w": "flying shuttle",
                    "u": 1
                  },
                  {
                    "w": "fustian",
                    "u": 1
                  },
                  {
                    "w": "Arkwright",
                    "u": 1
                  },
                  {
                    "w": "revolution",
                    "u": 1
                  },
                  {
                    "w": "handloom",
                    "u": 1
                  },
                  {
                    "w": "nimble",
                    "u": 1
                  },
                  {
                    "w": "shuttle",
                    "u": 1
                  },
                  {
                    "w": "ontemporaries",
                    "u": 1
                  },
                  {
                    "w": "water frame",
                    "u": 1
                  },
                  {
                    "w": "warp",
                    "u": 1
                  },
                  {
                    "w": "flexible",
                    "u": 1
                  },
                  {
                    "w": "woven",
                    "u": 1
                  },
                  {
                    "w": "weft",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Steam changes Manchester",
                "words": [
                  {
                    "w": "teemed",
                    "u": 1
                  },
                  {
                    "w": "partitions",
                    "u": 1
                  },
                  {
                    "w": "noxious",
                    "u": 1
                  },
                  {
                    "w": "venture",
                    "u": 1
                  },
                  {
                    "w": "bought the lease",
                    "u": 1
                  },
                  {
                    "w": "premises",
                    "u": 1
                  },
                  {
                    "w": "took their ease",
                    "u": 1
                  },
                  {
                    "w": "ceaseless",
                    "u": 1
                  },
                  {
                    "w": "whirring",
                    "u": 1
                  },
                  {
                    "w": "ailments",
                    "u": 1
                  },
                  {
                    "w": "privy",
                    "u": 1
                  },
                  {
                    "w": "awestruck",
                    "u": 1
                  },
                  {
                    "w": "rabbit warren",
                    "u": 1
                  },
                  {
                    "w": "unscrupulous",
                    "u": 1
                  },
                  {
                    "w": "clogs",
                    "u": 1
                  },
                  {
                    "w": "outdo",
                    "u": 1
                  },
                  {
                    "w": "underworld",
                    "u": 2
                  }
                ]
              },
              {
                "n": 4,
                "title": "Abel’s worlds",
                "words": [
                  {
                    "w": "Corn Laws",
                    "u": 1
                  },
                  {
                    "w": "subscribing",
                    "u": 1
                  },
                  {
                    "w": "intellects",
                    "u": 1
                  },
                  {
                    "w": "lectures",
                    "u": 1
                  },
                  {
                    "w": "subscription",
                    "u": 1
                  },
                  {
                    "w": "pamphlets",
                    "u": 1
                  },
                  {
                    "w": "manufacturers",
                    "u": 1
                  },
                  {
                    "w": "yeomanry",
                    "u": 1
                  },
                  {
                    "w": "demonstrate",
                    "u": 1
                  },
                  {
                    "w": "Peterloo",
                    "u": 1
                  },
                  {
                    "w": "magistrates",
                    "u": 1
                  },
                  {
                    "w": "demands",
                    "u": 1
                  },
                  {
                    "w": "Sunday best",
                    "u": 1
                  },
                  {
                    "w": "reform",
                    "u": 1
                  },
                  {
                    "w": "radical",
                    "u": 1
                  },
                  {
                    "w": "radicals",
                    "u": 1
                  },
                  {
                    "w": "political",
                    "u": 1
                  },
                  {
                    "w": "strikes",
                    "u": 1
                  },
                  {
                    "w": "Parliament",
                    "u": 2
                  },
                  {
                    "w": "petition",
                    "u": 2
                  },
                  {
                    "w": "livelihoods",
                    "u": 1
                  },
                  {
                    "w": "powerloom",
                    "u": 1
                  },
                  {
                    "w": "oversupply",
                    "u": 1
                  },
                  {
                    "w": "universal suffrage",
                    "u": 1
                  },
                  {
                    "w": "eligible",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Prison, protest, politics and print",
                "words": [
                  {
                    "w": "make an example of",
                    "u": 1
                  },
                  {
                    "w": "enterprise",
                    "u": 1
                  },
                  {
                    "w": "alerting",
                    "u": 1
                  },
                  {
                    "w": "illegal",
                    "u": 1
                  },
                  {
                    "w": "acquaint",
                    "u": 1
                  },
                  {
                    "w": "agitating",
                    "u": 1
                  },
                  {
                    "w": "tagline",
                    "u": 1
                  },
                  {
                    "w": "ignorance",
                    "u": 1
                  },
                  {
                    "w": "intellectual",
                    "u": 1
                  },
                  {
                    "w": "Members of Parliament",
                    "u": 1
                  },
                  {
                    "w": "middle classes",
                    "u": 1
                  },
                  {
                    "w": "dialect",
                    "u": 1
                  },
                  {
                    "w": "enterprising",
                    "u": 1
                  },
                  {
                    "w": "undoubtedly",
                    "u": 1
                  },
                  {
                    "w": "rowsing",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "The people’s town hall",
                "words": [
                  {
                    "w": "incorporation",
                    "u": 1
                  },
                  {
                    "w": "fizzled out",
                    "u": 1
                  },
                  {
                    "w": "at its forefront",
                    "u": 1
                  },
                  {
                    "w": "town council",
                    "u": 2
                  },
                  {
                    "w": "steamroller",
                    "u": 1
                  },
                  {
                    "w": "ratepayers",
                    "u": 1
                  },
                  {
                    "w": "incorporated",
                    "u": 2
                  },
                  {
                    "w": "mayor",
                    "u": 1
                  },
                  {
                    "w": "jubilant",
                    "u": 1
                  },
                  {
                    "w": "locomotive",
                    "u": 1
                  },
                  {
                    "w": "gothic",
                    "u": 1
                  },
                  {
                    "w": "insurmountable",
                    "u": 1
                  },
                  {
                    "w": "stood for",
                    "u": 1
                  },
                  {
                    "w": "laid off",
                    "u": 1
                  },
                  {
                    "w": "relief",
                    "u": 2
                  },
                  {
                    "w": "mahogany",
                    "u": 2
                  },
                  {
                    "w": "innovation",
                    "u": 1
                  },
                  {
                    "w": "wryly",
                    "u": 1
                  },
                  {
                    "w": "level crossing",
                    "u": 1
                  },
                  {
                    "w": "come to fruition",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "changing-birmingham-6spring1",
            "title": "Changing Birmingham",
            "chapters": [
              {
                "n": 1,
                "title": "Growing Birmingham",
                "words": [
                  {
                    "w": "construction",
                    "u": 2
                  },
                  {
                    "w": "increase",
                    "u": 1
                  },
                  {
                    "w": "natural",
                    "u": 1
                  },
                  {
                    "w": "skills",
                    "u": 1
                  },
                  {
                    "w": "geographical",
                    "u": 1
                  },
                  {
                    "w": "environment",
                    "u": 3
                  },
                  {
                    "w": "built",
                    "u": 1
                  },
                  {
                    "w": "incorporated",
                    "u": 2
                  },
                  {
                    "w": "accessible",
                    "u": 1
                  },
                  {
                    "w": "trend",
                    "u": 2
                  },
                  {
                    "w": "poverty",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Industrial Birmingham",
                "words": [
                  {
                    "w": "industrialists",
                    "u": 1
                  },
                  {
                    "w": "racial discrimination",
                    "u": 1
                  },
                  {
                    "w": "profitable",
                    "u": 1
                  },
                  {
                    "w": "narrowboats",
                    "u": 1
                  },
                  {
                    "w": "converge",
                    "u": 1
                  },
                  {
                    "w": "Black Country",
                    "u": 1
                  },
                  {
                    "w": "back-to-back houses",
                    "u": 1
                  },
                  {
                    "w": "shares",
                    "u": 1
                  },
                  {
                    "w": "tenants",
                    "u": 1
                  },
                  {
                    "w": "heritage",
                    "u": 2
                  },
                  {
                    "w": "colliery",
                    "u": 1
                  },
                  {
                    "w": "expense",
                    "u": 1
                  },
                  {
                    "w": "funded",
                    "u": 1
                  },
                  {
                    "w": "Parliament",
                    "u": 2
                  },
                  {
                    "w": "industrialisation",
                    "u": 1
                  },
                  {
                    "w": "yard",
                    "u": 1
                  },
                  {
                    "w": "filigree",
                    "u": 1
                  },
                  {
                    "w": "abounded",
                    "u": 1
                  },
                  {
                    "w": "deteriorated",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Growth, decline and redevelopment",
                "words": [
                  {
                    "w": "unemployment",
                    "u": 1
                  },
                  {
                    "w": "long-term impact",
                    "u": 1
                  },
                  {
                    "w": "acquaintances",
                    "u": 1
                  },
                  {
                    "w": "redeveloped",
                    "u": 1
                  },
                  {
                    "w": "redevelopment",
                    "u": 1
                  },
                  {
                    "w": "inner city",
                    "u": 1
                  },
                  {
                    "w": "industrial decline",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Changing Birmingham",
                "words": [
                  {
                    "w": "hospitality",
                    "u": 2
                  },
                  {
                    "w": "congestion",
                    "u": 1
                  },
                  {
                    "w": "futuristic",
                    "u": 1
                  },
                  {
                    "w": "promotes",
                    "u": 1
                  },
                  {
                    "w": "leisure",
                    "u": 1
                  },
                  {
                    "w": "habitation",
                    "u": 1
                  },
                  {
                    "w": "renovated",
                    "u": 1
                  },
                  {
                    "w": "conference",
                    "u": 1
                  },
                  {
                    "w": "tram",
                    "u": 1
                  },
                  {
                    "w": "bypass",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Sustainable Birmingham",
                "words": [
                  {
                    "w": "connectivity",
                    "u": 1
                  },
                  {
                    "w": "budget",
                    "u": 1
                  },
                  {
                    "w": "Urban planning",
                    "u": 1
                  },
                  {
                    "w": "resilience",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Future Birmingham",
                "words": [
                  {
                    "w": "district",
                    "u": 1
                  },
                  {
                    "w": "funding",
                    "u": 1
                  },
                  {
                    "w": "sample",
                    "u": 1
                  },
                  {
                    "w": "representative",
                    "u": 2
                  },
                  {
                    "w": "research",
                    "u": 1
                  },
                  {
                    "w": "data",
                    "u": 1
                  },
                  {
                    "w": "Commonwealth Games",
                    "u": 1
                  },
                  {
                    "w": "host city",
                    "u": 1
                  },
                  {
                    "w": "informed",
                    "u": 1
                  },
                  {
                    "w": "anti-social behaviour",
                    "u": 1
                  },
                  {
                    "w": "consult",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "6",
      "term": "Spring2",
      "cols": {
        "History": [
          {
            "id": "era-of-ww2-6spring2",
            "title": "Era of WW2",
            "chapters": [
              {
                "n": 1,
                "title": "The Phoney War",
                "words": [
                  {
                    "w": "insight",
                    "u": 1
                  },
                  {
                    "w": "enamel",
                    "u": 1
                  },
                  {
                    "w": "hand-me-down",
                    "u": 1
                  },
                  {
                    "w": "wireless",
                    "u": 1
                  },
                  {
                    "w": "bulletins",
                    "u": 1
                  },
                  {
                    "w": "reassured",
                    "u": 1
                  },
                  {
                    "w": "gas mask",
                    "u": 1
                  },
                  {
                    "w": "autobiography",
                    "u": 1
                  },
                  {
                    "w": "Winston Churchill",
                    "u": 1
                  },
                  {
                    "w": "home front",
                    "u": 1
                  },
                  {
                    "w": "billeted",
                    "u": 1
                  },
                  {
                    "w": "Adolf Hitler",
                    "u": 1
                  },
                  {
                    "w": "evacuation",
                    "u": 1
                  },
                  {
                    "w": "Evacuees",
                    "u": 1
                  },
                  {
                    "w": "air raids",
                    "u": 1
                  },
                  {
                    "w": "Phoney War",
                    "u": 1
                  },
                  {
                    "w": "propaganda",
                    "u": 1
                  },
                  {
                    "w": "evacuated",
                    "u": 2
                  }
                ]
              },
              {
                "n": 2,
                "title": "The real war",
                "words": [
                  {
                    "w": "blackout regulations",
                    "u": 1
                  },
                  {
                    "w": "Battle of Britain",
                    "u": 1
                  },
                  {
                    "w": "Anderson Shelters",
                    "u": 1
                  },
                  {
                    "w": "wardens",
                    "u": 1
                  },
                  {
                    "w": "Anderson Shelter",
                    "u": 1
                  },
                  {
                    "w": "drone",
                    "u": 1
                  },
                  {
                    "w": "intensified",
                    "u": 2
                  },
                  {
                    "w": "Blitz",
                    "u": 1
                  },
                  {
                    "w": "arsenal",
                    "u": 1
                  },
                  {
                    "w": "all clear",
                    "u": 1
                  },
                  {
                    "w": "Luftwaffe",
                    "u": 1
                  },
                  {
                    "w": "consecutive",
                    "u": 1
                  },
                  {
                    "w": "shimmer",
                    "u": 1
                  },
                  {
                    "w": "barrage balloons",
                    "u": 1
                  },
                  {
                    "w": "Air raid shelters",
                    "u": 1
                  },
                  {
                    "w": "Royal Air Force",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "War in the countryside,",
                "words": [
                  {
                    "w": "ration book",
                    "u": 1
                  },
                  {
                    "w": "coupons",
                    "u": 1
                  },
                  {
                    "w": "allocated",
                    "u": 1
                  },
                  {
                    "w": "ministers",
                    "u": 1
                  },
                  {
                    "w": "the black market",
                    "u": 1
                  },
                  {
                    "w": "allotments",
                    "u": 1
                  },
                  {
                    "w": "enticing",
                    "u": 1
                  },
                  {
                    "w": "shearing",
                    "u": 1
                  },
                  {
                    "w": "substitute",
                    "u": 1
                  },
                  {
                    "w": "hostels",
                    "u": 1
                  },
                  {
                    "w": "rationing",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "The Windrush generation",
                "words": [
                  {
                    "w": "VE Day",
                    "u": 1
                  },
                  {
                    "w": "MBE",
                    "u": 1
                  },
                  {
                    "w": "Buckingham Palace",
                    "u": 1
                  },
                  {
                    "w": "Windrush generation",
                    "u": 1
                  },
                  {
                    "w": "Carnival",
                    "u": 1
                  },
                  {
                    "w": "race relations",
                    "u": 1
                  },
                  {
                    "w": "lay preacher",
                    "u": 1
                  },
                  {
                    "w": "acute",
                    "u": 1
                  },
                  {
                    "w": "Racism",
                    "u": 1
                  },
                  {
                    "w": "labour exchange",
                    "u": 1
                  },
                  {
                    "w": "ran  the headline",
                    "u": 1
                  },
                  {
                    "w": "Tilbury  docks",
                    "u": 1
                  },
                  {
                    "w": "politicians",
                    "u": 1
                  },
                  {
                    "w": "Commonwealth citizenship",
                    "u": 1
                  },
                  {
                    "w": "passage",
                    "u": 1
                  },
                  {
                    "w": "revellers",
                    "u": 1
                  },
                  {
                    "w": "enlisted",
                    "u": 1
                  },
                  {
                    "w": "Empire Windrush",
                    "u": 1
                  },
                  {
                    "w": "mother country",
                    "u": 1
                  },
                  {
                    "w": "Trinidad",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "Health, welfare and schools",
                "words": [
                  {
                    "w": "insurance",
                    "u": 1
                  },
                  {
                    "w": "scholarships",
                    "u": 1
                  },
                  {
                    "w": "insatiable",
                    "u": 1
                  },
                  {
                    "w": "inquisitive",
                    "u": 1
                  },
                  {
                    "w": "National Health Service (NHS)",
                    "u": 1
                  },
                  {
                    "w": "steels",
                    "u": 1
                  },
                  {
                    "w": "pit",
                    "u": 1
                  },
                  {
                    "w": "ceremoniously",
                    "u": 1
                  },
                  {
                    "w": "elementary",
                    "u": 1
                  },
                  {
                    "w": "fees",
                    "u": 1
                  },
                  {
                    "w": "matron",
                    "u": 1
                  },
                  {
                    "w": "Beveridge Report",
                    "u": 1
                  },
                  {
                    "w": "welfare",
                    "u": 3
                  },
                  {
                    "w": "vulnerable",
                    "u": 2
                  },
                  {
                    "w": "National Insurance",
                    "u": 1
                  },
                  {
                    "w": "welfare state",
                    "u": 1
                  },
                  {
                    "w": "pensions",
                    "u": 1
                  },
                  {
                    "w": "entourage",
                    "u": 1
                  },
                  {
                    "w": "general election",
                    "u": 1
                  },
                  {
                    "w": "Bevan",
                    "u": 1
                  },
                  {
                    "w": "seamstress",
                    "u": 1
                  },
                  {
                    "w": "trade union",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Geography": [
          {
            "id": "jamaica-6spring2",
            "title": "Jamaica",
            "chapters": [
              {
                "n": 0,
                "title": "0",
                "words": [
                  {
                    "w": "mahogany",
                    "u": 2
                  },
                  {
                    "w": "package",
                    "u": 1
                  }
                ]
              },
              {
                "n": 1,
                "title": "Orlene’s migration story",
                "words": [
                  {
                    "w": "gully",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Diverse Jamaica",
                "words": [
                  {
                    "w": "plantations",
                    "u": 1
                  },
                  {
                    "w": "motto",
                    "u": 1
                  },
                  {
                    "w": "limestone",
                    "u": 1
                  },
                  {
                    "w": "mangrove swamps",
                    "u": 1
                  },
                  {
                    "w": "sinkhole",
                    "u": 1
                  },
                  {
                    "w": "eye-witness",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Hurricane Beryl",
                "words": [
                  {
                    "w": "hurricane-prone",
                    "u": 1
                  },
                  {
                    "w": "devastation",
                    "u": 1
                  },
                  {
                    "w": "sandbags",
                    "u": 1
                  },
                  {
                    "w": "peak",
                    "u": 2
                  },
                  {
                    "w": "landfall",
                    "u": 1
                  },
                  {
                    "w": "storm surge",
                    "u": 1
                  },
                  {
                    "w": "tropical storm",
                    "u": 1
                  },
                  {
                    "w": "tornadoes",
                    "u": 1
                  },
                  {
                    "w": "eye",
                    "u": 1
                  },
                  {
                    "w": "severity",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "Why do tourists visit Jamaica?",
                "words": [
                  {
                    "w": "pursuits",
                    "u": 1
                  },
                  {
                    "w": "motivate",
                    "u": 1
                  },
                  {
                    "w": "botany",
                    "u": 1
                  },
                  {
                    "w": "snorkel",
                    "u": 1
                  },
                  {
                    "w": "scuba diving",
                    "u": 1
                  },
                  {
                    "w": "yachts",
                    "u": 1
                  },
                  {
                    "w": "plantation",
                    "u": 1
                  },
                  {
                    "w": "reggae",
                    "u": 1
                  },
                  {
                    "w": "Bob Marley",
                    "u": 1
                  },
                  {
                    "w": "all-inclusive resort",
                    "u": 1
                  },
                  {
                    "w": "disembark",
                    "u": 1
                  },
                  {
                    "w": "moorings",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "What is the impact of tourism on Jamaica?",
                "words": [
                  {
                    "w": "compensate",
                    "u": 1
                  },
                  {
                    "w": "Environmental impacts",
                    "u": 1
                  },
                  {
                    "w": "mass tourism",
                    "u": 1
                  },
                  {
                    "w": "Investment",
                    "u": 1
                  },
                  {
                    "w": "quality of life",
                    "u": 1
                  },
                  {
                    "w": "Social impacts",
                    "u": 1
                  },
                  {
                    "w": "invest",
                    "u": 1
                  },
                  {
                    "w": "community tourism",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "How should tourism be developed in the future?",
                "words": [
                  {
                    "w": "consultant",
                    "u": 1
                  },
                  {
                    "w": "strategy",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ],
        "Religion": [
          {
            "id": "stories-which-point-to-truth-6spring2",
            "title": "Stories which point to truth",
            "chapters": [
              {
                "n": 1,
                "title": "A man called Aesop",
                "words": [
                  {
                    "w": "Aesop",
                    "u": 1
                  },
                  {
                    "w": "sacrilege",
                    "u": 1
                  },
                  {
                    "w": "goblet",
                    "u": 1
                  },
                  {
                    "w": "sojourn",
                    "u": 1
                  },
                  {
                    "w": "residency",
                    "u": 1
                  },
                  {
                    "w": "wit",
                    "u": 1
                  },
                  {
                    "w": "witty",
                    "u": 1
                  },
                  {
                    "w": "undigested",
                    "u": 1
                  },
                  {
                    "w": "illiterate",
                    "u": 1
                  },
                  {
                    "w": "resonate",
                    "u": 1
                  },
                  {
                    "w": "fables",
                    "u": 1
                  },
                  {
                    "w": "derives from",
                    "u": 1
                  },
                  {
                    "w": "a household name",
                    "u": 1
                  },
                  {
                    "w": "Aesop’s Fables",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "More fables",
                "words": [
                  {
                    "w": "renched",
                    "u": 1
                  },
                  {
                    "w": "flailing",
                    "u": 1
                  },
                  {
                    "w": "torrent",
                    "u": 1
                  },
                  {
                    "w": "Stymied",
                    "u": 1
                  },
                  {
                    "w": "conceded",
                    "u": 1
                  },
                  {
                    "w": "brook",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "The Hare and the Tortoise",
                "words": [
                  {
                    "w": "capered",
                    "u": 1
                  },
                  {
                    "w": "Scouring",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Fables about how to treat others",
                "words": [
                  {
                    "w": "phenomena",
                    "u": 1
                  },
                  {
                    "w": "Aesop’s Fables do",
                    "u": 1
                  },
                  {
                    "w": "appointed",
                    "u": 3
                  },
                  {
                    "w": "dog in the manger",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "What does it mean to live a moral life?",
                "words": [
                  {
                    "w": "welfare",
                    "u": 3
                  },
                  {
                    "w": "fundamental",
                    "u": 1
                  },
                  {
                    "w": "brag",
                    "u": 1
                  },
                  {
                    "w": "humanism",
                    "u": 1
                  },
                  {
                    "w": "non-religious",
                    "u": 1
                  },
                  {
                    "w": "humanists",
                    "u": 1
                  },
                  {
                    "w": "humanist",
                    "u": 1
                  },
                  {
                    "w": "divine revelation",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "year": "6",
      "term": "Summer1",
      "cols": {
        "Religion": [
          {
            "id": "reason-and-revelation-6summer1",
            "title": "Reason and revelation",
            "chapters": [
              {
                "n": 1,
                "title": "The woman who knew too much",
                "words": [
                  {
                    "w": "complex",
                    "u": 1
                  },
                  {
                    "w": "emanated",
                    "u": 1
                  },
                  {
                    "w": "bestowed",
                    "u": 1
                  },
                  {
                    "w": "reason",
                    "u": 1
                  },
                  {
                    "w": "crucial",
                    "u": 2
                  },
                  {
                    "w": "Hypatia",
                    "u": 1
                  },
                  {
                    "w": "lecture",
                    "u": 1
                  },
                  {
                    "w": "the ancients",
                    "u": 1
                  },
                  {
                    "w": "Sirius",
                    "u": 1
                  },
                  {
                    "w": "lighthouse",
                    "u": 1
                  },
                  {
                    "w": "horizon",
                    "u": 2
                  },
                  {
                    "w": "dial",
                    "u": 1
                  },
                  {
                    "w": "abacus",
                    "u": 1
                  },
                  {
                    "w": "commentary",
                    "u": 1
                  },
                  {
                    "w": "heavenly bodies",
                    "u": 1
                  },
                  {
                    "w": "Hellenistic",
                    "u": 1
                  }
                ]
              },
              {
                "n": 2,
                "title": "Alexandria: city of philosophy",
                "words": [
                  {
                    "w": "theistic",
                    "u": 1
                  },
                  {
                    "w": "theos",
                    "u": 1
                  },
                  {
                    "w": "Unmoved Mover",
                    "u": 1
                  },
                  {
                    "w": "reality",
                    "u": 1
                  },
                  {
                    "w": "mused",
                    "u": 1
                  },
                  {
                    "w": "melting pot",
                    "u": 1
                  },
                  {
                    "w": "pursuit",
                    "u": 1
                  },
                  {
                    "w": "Museum",
                    "u": 1
                  },
                  {
                    "w": "inspired",
                    "u": 3
                  },
                  {
                    "w": "eclectic",
                    "u": 1
                  },
                  {
                    "w": "inspiration",
                    "u": 1
                  },
                  {
                    "w": "theology",
                    "u": 1
                  },
                  {
                    "w": "theist",
                    "u": 1
                  }
                ]
              },
              {
                "n": 3,
                "title": "Where did the universe come from?",
                "words": [
                  {
                    "w": "might",
                    "u": 1
                  },
                  {
                    "w": "Hellenised",
                    "u": 1
                  },
                  {
                    "w": "catalogued",
                    "u": 1
                  },
                  {
                    "w": "magnet",
                    "u": 1
                  },
                  {
                    "w": "cosmos",
                    "u": 1
                  },
                  {
                    "w": "tend",
                    "u": 1
                  },
                  {
                    "w": "ex nihilo",
                    "u": 1
                  },
                  {
                    "w": "repository",
                    "u": 1
                  }
                ]
              },
              {
                "n": 4,
                "title": "But how do you know?",
                "words": [
                  {
                    "w": "scepticism",
                    "u": 1
                  },
                  {
                    "w": "the Enlightenment",
                    "u": 1
                  },
                  {
                    "w": "replica",
                    "u": 1
                  },
                  {
                    "w": "soar",
                    "u": 1
                  },
                  {
                    "w": "notable",
                    "u": 1
                  },
                  {
                    "w": "David Hume",
                    "u": 1
                  },
                  {
                    "w": "tavern",
                    "u": 1
                  },
                  {
                    "w": "atheist",
                    "u": 1
                  },
                  {
                    "w": "sceptic",
                    "u": 1
                  },
                  {
                    "w": "Edinburgh",
                    "u": 1
                  },
                  {
                    "w": "sceptical",
                    "u": 1
                  },
                  {
                    "w": "agnostic",
                    "u": 1
                  }
                ]
              },
              {
                "n": 5,
                "title": "Are you sure you can know?",
                "words": [
                  {
                    "w": "Kant",
                    "u": 1
                  },
                  {
                    "w": "literally",
                    "u": 1
                  },
                  {
                    "w": "morality",
                    "u": 1
                  },
                  {
                    "w": "innate",
                    "u": 1
                  },
                  {
                    "w": "put pen to paper",
                    "u": 1
                  },
                  {
                    "w": "posited",
                    "u": 1
                  },
                  {
                    "w": "inability",
                    "u": 1
                  },
                  {
                    "w": "clung",
                    "u": 1
                  },
                  {
                    "w": "clockwork",
                    "u": 1
                  },
                  {
                    "w": "cane",
                    "u": 1
                  }
                ]
              },
              {
                "n": 6,
                "title": "What is the purpose of life?",
                "words": [
                  {
                    "w": "purpose",
                    "u": 1
                  },
                  {
                    "w": "lecturer",
                    "u": 1
                  },
                  {
                    "w": "utility",
                    "u": 1
                  },
                  {
                    "w": "utilitarianism",
                    "u": 1
                  },
                  {
                    "w": "John Stuart Mill",
                    "u": 1
                  },
                  {
                    "w": "evoked",
                    "u": 1
                  },
                  {
                    "w": "utilitarian",
                    "u": 1
                  },
                  {
                    "w": "appealing to",
                    "u": 1
                  },
                  {
                    "w": "worldview",
                    "u": 1
                  },
                  {
                    "w": "supernatural",
                    "u": 1
                  },
                  {
                    "w": "replicating",
                    "u": 1
                  },
                  {
                    "w": "awe",
                    "u": 1
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
}
