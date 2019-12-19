<template >
  <div>
      <div class='paginated-list-item publication-list-item'>
        <div v-for="article in author.article" class="container article-container">
              <div class='publication-list-item-details'>
                <div class='publication-list-item-title-publication margin-bottom-sm'>
                  <a class='publication-list-item-title very-dark-gray-link' style="font-size:18px!important; cursor:text; line-height:20px;">
                    {{ article.title }}
                  </a>
                </div>
                <div>
                  <div class='publication-list-item-journal-copy'>
                    <div v-if='article.fields && article.fields != "-1"' style="display:flex; justify-content:start; margin:10px 0;">
                      <el-tooltip class="item" effect="light" placement="top" v-bind:key="field" v-for="field in article.fields">
                        <div slot="content">
                          <ul style="list-style-type:none; padding-left:0;">
                            <li v-for="cat in article.sub_cat" v-if="assoc_cat[field].map(function(x){ return x.toLowerCase()}).includes(cat.toLowerCase())">
                              {{ cat[0].toUpperCase() + cat.replace(/_/gi, ' ').slice(1) }}
                            </li>
                          </ul>
                        </div>
                        <el-tag size="small" style="margin-bottom:5px">
                          {{ field[0].toUpperCase() + field.replace(/_/gi, ' ').slice(1) }}
                        </el-tag>
                      </el-tooltip>
                    </div>
                    <p class='publication-list-item-journal-published-copy' style="display:inline-block; margin-bottom:5px;">
                    Authors: <a v-for="(auth, index) in author.list_auth" style="display:inline; cursor:text;">
                        <strong v-if="author.pos == index" style="display:inline">{{ auth.name }}<span v-if="index < author.list_auth.length -1">, </span></strong>
                        <span v-else style="display:inline">{{ auth.name }}<span v-if="index < author.list_auth.length -1">, </span></span>
                      </a>
                    </p>
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;" v-if='article.journal'>
                    Published: <a class='very-dark-gray-link' style="cursor:text;">{{ article.year }}</a>
                    , IN: <a class='very-dark-gray-link' style="cursor:text;">{{ article.journal }}</a>
                    </p>
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;" v-if='article.doi'>
                      DOI: <a class='very-dark-gray-link' target="new" :href="article.doi">{{ article.doi }}</a>
                    </p>
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;" v-if='article.inCitations'>
                      Citations: <a class='very-dark-gray-link' style="cursor:text;">{{ article.inCitations }}+</a>
                    </p>
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;" v-if="article.abstract">
                      <el-tooltip class="item" effect="dark" :content="article.abstract" placement="right">
                        <el-tag size="small" type="success" style="margin-top:5px">Abstract</el-tag>
                      </el-tooltip>
                    </p>
                  </div>
                </div>
              </div>
        </div>
      <div class='pertinence'>
        <p>Pertinence:
          <span v-if="typeof list.list_failed[index] != 'undefined'" style="color:#F56C6C">No</span>
          <span v-else style="color:#67C23A">Yes</span>
        </p>
      </div>
      <div class='publication-list-item-citations'>
        <el-popover
          ref="popcheck"
          placement="top"
          v-model="visibleB">
          <p>Are you sure you want to validate this author?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visibleB = false">Cancel</el-button>
            <el-button type="primary" size="mini" v-on:click="$emit('validate')">Confirm</el-button>
          </div>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="The author match" placement="top">
          <el-button
            type="success"
            size="mini"
            plain
            icon="el-icon-check"
            circle
            v-popover:popcheck>
          </el-button>
        </el-tooltip>

        <el-popover
          ref="popdel"
          placement="top"
          v-model="visible">
          <p>Are you sure you want to unmatch this author?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">Cancel</el-button>
            <el-button type="primary" size="mini" v-on:click="$emit('close')">Confirm</el-button>
          </div>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="The author does not match" placement="top">
          <el-button
            type="info"
            size="mini"
            plain
            icon="el-icon-close"
            circle
            v-popover:popdel>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["author", "index", "list"],
  data () {
    return {
      visible: false,
      visibleB: false,
      assoc_cat: {
        "art_and_humanities": [
            "Archeology (arts and humanities)",
            "Arts and Humanities",
            "Classics",
            "Conservation",
            "History",
            "History and Philosophy of Science",
            "Issues, Ethics and Legal Aspects",
            "Language and Linguistics",
            "Linguistics and Language",
            "Literature and Literary Theory",
            "Museology",
            "Music",
            "Philosophy",
            "Religious Studies",
            "Visual Arts and Performing Arts"
        ],
        "biology": [
            "Aging",
            "Agricultural and Biological Sciences",
            "Agronomy and Crop Science",
            "Animal Science and Zoology",
            "Applied Microbiology and Biotechnology",
            "Aquatic Science",
            "Behavioral Neuroscience",
            "Biochemistry",
            "Biochemistry, Genetics and Molecular Biology",
            "Bioengineering",
            "Biomaterials",
            "Biomedical Engineering",
            "Biophysics",
            "Biotechnology",
            "Cancer Research",
            "Cell Biology",
            "Clinical Biochemistry",
            "Developmental Biology",
            "Developmental Neuroscience",
            "Drug Discovery",
            "Ecology, Evolution, Behavior and Systematics",
            "Food Animals",
            "Food Science",
            "Forestry",
            "Genetics",
            "Health, Toxicology and Mutagenesis",
            "Horticulture",
            "Immunology",
            "Immunology and Microbiology",
            "Insect Science",
            "Microbiology",
            "Molecular Biology",
            "Parasitology",
            "Pharmaceutical Science",
            "Pharmacology",
            "Pharmacology, Toxicology and Pharmaceutics",
            "Pharmacy",
            "Physiology",
            "Plant Science",
            "Small Animals",
            "Soil Science",
            "Structural Biology",
            "Toxicology",
            "Virology"
        ],
        "business_and_economics": [
            "Accounting",
            "Business and International Management",
            "Business, Management and Accounting",
            "Decision Sciences",
            "Economics and Econometrics",
            "Economics, Econometrics and Finance",
            "Finance",
            "Industrial Relations",
            "Leadership and Management",
            "Management of Technology and Innovation",
            "Management Science and Operations Research",
            "Management, Monitoring, Policy and Law",
            "Marketing",
            "Organizational Behavior and Human Resource Management",
            "Strategy and Management",
            "Tourism, Leisure and Hospitality Management"
        ],
        "computer_science": [
            "Artificial Intelligence",
            "Computational Mechanics",
            "Computational Theory and Mathematics",
            "Computer Graphics and Computer-Aided Design",
            "Computer Networks and Communications",
            "Computer Science",
            "Computer Science Applications",
            "Computer Vision and Pattern Recognition",
            "Computers in Earth Sciences",
            "Hardware and Architecture",
            "Human-Computer Interaction",
            "Information Systems",
            "Information Systems and Management",
            "Management Information Systems",
            "Modeling and Simulation",
            "Signal Processing",
            "Software",
            "Theoretical Computer Science"
        ],
        "chemistry": [
            "Analytical Chemistry",
            "Biochemistry",
            "Biochemistry, Genetics and Molecular Biology",
            "Catalysis",
            "Chemical Engineering",
            "Chemistry",
            "Clinical Biochemistry",
            "Colloid and Surface Chemistry",
            "Electrochemistry",
            "Environmental Chemistry",
            "Filtration and Separation",
            "Fluid Flow and Transfer Processes",
            "Inorganic Chemistry",
            "Materials Chemistry",
            "Organic Chemistry",
            "Physical and Theoretical Chemistry",
            "Process Chemistry and Technology",
            "Spectroscopy"
        ],
        "earth_and_planetary_sciences": [
            "Atmospheric Science",
            "Earth and Planetary Sciences",
            "Earth-Surface Processes",
            "Economic Geology",
            "Geochemistry and Petrology",
            "Geology",
            "Geophysics",
            "Geotechnical Engineering and Engineering Geology",
            "Oceanography",
            "Paleontology",
            "Space and Planetary Science",
            "Stratigraphy"
        ],
        "engineering": [
            "Aerospace Engineering",
            "Architecture",
            "Automotive Engineering",
            "Bioengineering",
            "Biomedical Engineering",
            "Building and Construction",
            "Civil and Structural Engineering",
            "Control and Systems Engineering",
            "Electrical and Electronic Engineering",
            "Engineering",
            "Environmental Engineering",
            "Filtration and Separation",
            "Industrial and Manufacturing Engineering",
            "Mechanical Engineering",
            "Mechanics of Materials",
            "Media Technology",
            "Ocean Engineering",
            "Safety, Risk, Reliability and Quality"
        ],
        "environmental_science": [
            "Ecological Modeling",
            "Ecology",
            "Environmental Chemistry",
            "Environmental Engineering",
            "Environmental Science",
            "Global and Planetary Change",
            "Nature and Landscape Conservation",
            "Pollution",
            "Renewable Energy, Sustainability and the Environment",
            "Waste Management and Disposal",
            "Water Science and Technology"
        ],
        "health_profession": [
            "Chiropractics",
            "Complementary and Alternative Medicine",
            "Emergency Medical Services",
            "Health Information Management",
            "Health Professions",
            "Medical Assisting and Transcription",
            "Medical Laboratory Technology",
            "Medical Terminology",
            "Occupational Therapy",
            "Optometry",
            "Pharmacy",
            "Physical Therapy, Sports Therapy and Rehabilitation",
            "Podiatry",
            "Radiological and Ultrasound Technology",
            "Respiratory Care",
            "Speech and Hearing",
            "Sports Science"
        ],
        "materials_science": [
            "Biomaterials",
            "Ceramics and Composites",
            "Electronic, Optical and Magnetic Materials",
            "Energy",
            "Fuel Technology",
            "Materials Chemistry",
            "Materials Science",
            "Mechanics of Materials",
            "Metals and Alloys",
            "Nanoscience and Nanotechnology",
            "Polymers and Plastics",
            "Surfaces, Coatings and Films"
        ],
        "mathematics": [
            "Algebra and Number Theory",
            "Analysis",
            "Applied Mathematics",
            "Computational Mathematics",
            "Computational Theory and Mathematics",
            "Control and Optimization",
            "Discrete Mathematics and Combinatorics",
            "Geometry and Topology",
            "Logic",
            "Mathematical Physics",
            "Mathematics",
            "Numerical Analysis",
            "Statistics and Probability",
            "Statistics, Probability and Uncertainty"
        ],
        "medicine": [
            "Anatomy",
            "Anesthesiology and Pain Medicine",
            "Biochemistry (medical)",
            "Biomedical Engineering",
            "Cardiology and Cardiovascular Medicine",
            "Chemical Health and Safety",
            "Community and Home Care",
            "Complementary and Manual Therapy",
            "Critical Care and Intensive Care Medicine",
            "Dental Hygiene",
            "Dentistry",
            "Dermatology",
            "Drug Discovery",
            "Drug Guides",
            "Embryology",
            "Emergency Medicine",
            "Endocrinology",
            "Epidemiology",
            "Equine",
            "Family Practice",
            "Gastroenterology",
            "Genetics (clinical)",
            "Geriatrics and Gerontology",
            "Gerontology",
            "Health Informatics",
            "Health Policy",
            "Health, Toxicology and Mutagenesis",
            "Hematology",
            "Hepatology",
            "Histology",
            "Immunology and Allergy",
            "Infectious Diseases",
            "Internal Medicine",
            "Medicine",
            "Medicine (miscellaneous)",
            "Microbiology (medical)",
            "Molecular Medicine",
            "Nephrology",
            "Neurology (clinical)",
            "Obstetrics and Gynecology",
            "Oncology",
            "Ophthalmology",
            "Oral Surgery",
            "Orthodontics",
            "Orthopedics and Sports Medicine",
            "Otorhinolaryngology",
            "Pathology and Forensic Medicine",
            "Pediatrics, Perinatology and Child Health",
            "Periodontics",
            "Pharmacology (medical)",
            "Physiology (medical)",
            "Psychiatry and Mental Health",
            "Public Health, Environmental and Occupational Health",
            "Pulmonary and Respiratory Medicine",
            "Radiological and Ultrasound Technology",
            "Radiology, Nuclear Medicine and Imaging",
            "Rehabilitation",
            "Reproductive Medicine",
            "Reviews and References (medical)",
            "Rheumatology",
            "Surgery",
            "Transplantation",
            "Urology",
            "Veterinary"
        ],
        "neuroscience": [
            "Behavioral Neuroscience",
            "Biological Psychiatry",
            "Cellular and Molecular Neuroscience",
            "Cognitive Neuroscience",
            "Developmental Biology",
            "Endocrine and Autonomic Systems",
            "Neurology",
            "Neuroscience",
            "Sensory Systems"
        ],
        "nursing": [
            "Advanced and Specialized Nursing",
            "Assessment and Diagnosis",
            "Care Planning",
            "Community and Home Care",
            "Critical Care Nursing",
            "Emergency Nursing",
            "Fundamentals and Skills",
            "Gerontology",
            "LPN and LVN",
            "Maternity and Midwifery",
            "Medical and Surgical Nursing",
            "Nurse Assisting",
            "Nursing",
            "Nutrition and Dietetics",
            "Oncology (nursing)",
            "Pediatrics",
            "Pharmacology (nursing)",
            "Psychiatric Mental Health",
            "Research and Theory",
            "Review and Exam Preparation"
        ],
        "physics": [
            "Acoustics and Ultrasonics",
            "Astronomy and Astrophysics",
            "Atomic and Molecular Physics, and Optics",
            "Biophysics",
            "Condensed Matter Physics",
            "Energy Engineering and Power Technology",
            "Geophysics",
            "Instrumentation",
            "Mathematical Physics",
            "Nuclear and High Energy Physics",
            "Nuclear Energy and Engineering",
            "Physics and Astronomy",
            "Radiation",
            "Statistical and Nonlinear Physics",
            "Surfaces and Interfaces"
        ],
        "psychology": [
            "Applied Psychology",
            "Clinical Psychology",
            "Developmental and Educational Psychology",
            "Experimental and Cognitive Psychology",
            "Neuropsychology and Physiological Psychology",
            "Psychology",
            "Social Psychology"
        ],
        "sociology": [
            "Anthropology",
            "Archeology",
            "Communication",
            "Cultural Studies",
            "Demography",
            "Development",
            "E-learning",
            "Education",
            "Gender Studies",
            "Geography, Planning and Development",
            "Health (social science)",
            "Human Factors and Ergonomics",
            "Law",
            "Library and Information Sciences",
            "Life-span and Life-course Studies",
            "Political Science and International Relations",
            "Public Administration",
            "Safety Research",
            "Social Psychology",
            "Social Sciences",
            "Social Work",
            "Sociology and Political Science",
            "Transportation",
            "Urban Studies"
        ],
        "multidisciplinary": [
            "Multidisciplinary"
        ]
      }
    }
  },
  created() {

  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style>
ul {
  font-family: 'DNLTPro-regular';
}
.container {
   /* display: grid;
   grid-template-columns: 4fr 10px 1fr;
   grid-template-areas: "title   .      citations"; */
}
.paginated-list .paginated-list-item {
    padding: 20px 10px;
    border-bottom: 1px solid #ddd;
}
.publication-list-item {
    font-family: 'DNLTPro-regular';
}
.margin-bottom-sm {
    margin-bottom: 10px!important;
}
.publication-list-item a {
    color: #111;
}
a.very-dark-gray-link {
    color: #111;
}
.publication-list-item .publication-list-item-date, .publication-list-item .publication-list-item-journal {
    /*grid-area: journal;*/
    font-size: 12px!important;
    font-weight: 200;
}
.publication-list-item .publication-list-item-cached-journal {
    display: grid;
    grid-column-gap: 2px;
    grid-template-columns: 1fr 21fr;
}
.publication-list-item .publication-list-item-cached-journal .publication-list-item-journal-copy {
    line-height: 9px;
    font-size: 12px;
    font-weight: 300;
}
.publication-list-item .publication-list-item-journal-published-copy {
    margin-bottom: 0;
    color: #999;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font: inherit;
    vertical-align: top;
    -webkit-font-smoothing: antialiased;
}
.publication-list-item-journal-published-copy p {
    margin-bottom: 20px;
    line-height: 100%;
    max-width: 720px;
}
.publication-list-item a {
    color: #111;
}
.publication-list-item-details {
    grid-area: title;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    overflow: hidden;
    padding-top: 5px;
    padding-right: 10px;
    font-size: 12px;
    line-height: 14px;

}
.publication-list-item-citations {
    /* grid-area: citations;
    -webkit-box-flex: 2;
    -ms-flex-positive: 2;
    flex-grow: 2;
    overflow: hidden;
    padding-right: 10px;
    font-size: 24px; */
    text-align: right;
    margin-top: -45px;
}
.article-container {
  margin-bottom: 15px!important;
  padding-left: 30px;
  border-left: 1px solid lightgrey;
  width: 100%;
}
.publication-list-item-title{
  color: #999;
  font-size: 16px!important;
}
.publication-list-item .publication-list-item-date, .publication-list-item .publication-list-item-journal {
    /*grid-area: journal;*/
    font-size: 12px!important;
    font-weight: 200;
}

.el-tooltip__popper.is-dark{
  max-width: 400px;
  font-size: 15px;
  text-align: justify;
  padding: 20px;
}

.el-tooltip__popper.is-light{
  max-width: 400px;
  font-size: 13px;
  text-align: left!important;
  padding: 8px!important;
}

</style>
