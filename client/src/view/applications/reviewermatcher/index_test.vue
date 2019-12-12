<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="bandeau">ALPHA v0.3.3</div>
      <el-row :gutter='50' >
        <div class='head'>
          <h1>Reviewer search engine</h1>
          <h2>Getting the most relevant reviewers for your paper</h2>
        </div>
      </el-row>

      <el-row :gutter='30' style='margin-top=80px;'>
        <el-col :span='15'>
        <div class='description-container'>
          <div class='description'>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="What is it?" name="1">
                <div>
                  <p>The reviewer matcher is<b> a reviewer search engine</b> which helps you to find<b> the best reviewers</b> for your manuscrits</p>
                </div>
              </el-collapse-item>
              <el-collapse-item title="How does it work ?" name="2">
                <div>
                  <p>Load the <b>title, the abstract and the author</b> of the manuscript. The algorithm finds similarity between this article and all the articles in the database of articles.</p>
                </div>
              </el-collapse-item>
              <el-collapse-item title="Why a relevance test ?" name="3">
                <div>
                  <p><b><u>We need you to check the relevance of the search engine outputs.</u></b> When you click on an suggested author, you will see the most relevant article of this author. In the bottom right corner, you can validate or invalidate this match. The verified matches will be used to robustify the model. </p>
                  <p><b>Warning:</b> the conflict of interest is not completely operational</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        </el-col>
      </el-row>




        <h2>Load the article</h2>
        <p>Insert your publication informations (title, authors, abstract or keywords)</p>
        <p>You can also upload the pdf to extract the different fields </p>
        <el-tag type="warning" v-if="dataUpload" style="margin-bottom:28px;">Please check the information from the PDF extractor, it can be wrong or uncomplete</el-tag>
      <el-row :gutter='30' style='margin-top:30px'>
      <el-col :span='15'>
      <el-form  label-width="140px" :model="formPost" :rules="rules" ref="formPost" style='padding-bottom:20px;'>

        <el-form-item label="Title" prop="title">
          <el-input v-model="formPost.title"></el-input>
        </el-form-item>

        <el-form-item label="Keywords" prop="keywords">
          <el-tag
            :key="tag"
            v-for="tag in formPost.keywords"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Keyword</el-button>
        </el-form-item>

        <!-- Ajout authors -->
        <el-form-item label="Authors" prop="authors">
          <el-tag
            :key="aut"
            v-for="aut in formPost.authors"
            closable
            :disable-transitions="false"
            @close="handleCloseAut(aut)">
            {{aut}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleAut"
            v-model="inputValueAut"
            ref="saveAutInput"
            size="mini"
            @keyup.enter.native="handleInputConfirmAut"
            @blur="handleInputConfirmAut"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInputAut">+ New Author</el-button>
        </el-form-item>


        <el-form-item label="Abstract" prop="abstract">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 30}"
            placeholder="You have to input enter only english abstract"
            v-model="formPost.abstract" @change="replaceChariot">
          </el-input>
        </el-form-item>

        <el-form-item class="flex_items">
          <el-button type="info" @click="onSubmit('formPost')" :loading="load_var" class="button_tab">Search</el-button>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress_status" :format="format" class="progress_bar"></el-progress>
          <el-button @click="resetForm('formPost')" class="button_tab">Reset</el-button>
        </el-form-item>

      </el-form>
      </el-col>
      <el-col :span='1'>
        <div style='text-align:center; vertical-align:middle; height:100px;'><p style="margin:5px 0;">or</p></div>
      </el-col>
      <el-col :span='8'>
        <el-upload
        class="upload-demo"
        drag
        :on-change="uploadChange"
        :file-list="fileList"
        action=""
        :http-request="uploadSectionFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drop your pdf file here or <em>click to upload</em></div>
        <div class="el-upload__text"><strong>Powered by GROBID</strong></div>
      </el-upload>
      <el-progress :text-inside="true" :stroke-width="26" :percentage="progress_status_pdf" style="width:100%;margin-top:16px;"></el-progress>
      </el-col>
<!--
        <el-col :span='1'>
          <div style='text-align:center; vertical-align:middle; height:100px;'><p style="margin:5px 0;">or</p></div>
        </el-col>
        <el-col :span='11'>
          <el-upload
          class="upload-demo"
          drag
          action=""
          :http-request="uploadSectionFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop your pdf file here or <em>click to upload</em></div>
            <div class="el-upload__text"><strong>Powered by GROBID</strong></div>
          </el-upload>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress_status_pdf" style="width:100%;margin-top:16px;"></el-progress>
        </el-col>
      -->
      </el-row>




      <div id="scroll_anchor">
      <el-row v-if='isData' style='padding-top:20px; margin-bottom: 100px;'>
        <h2>Suggestion of Reviewers</h2>
        <!-- <el-button @click="send_list_pertinence()" type="success" plain>Send the list</el-button> -->
        <div style="margin:20px 0; display:flex; justify-content: space-between; align-items: center;">
          <el-tag type="warning">Warning : You can have multiple authors with the same affiliation</el-tag>
          <div>
            <el-button @click="exportListJson()">Export list (json)</el-button>
            <el-button @click="exportListCsv()">Export list (csv)</el-button>
          </div>
        </div>
        <el-table
          ref="refTable"
          row-key="id"
          highlight-current-row
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          @cell-click="displayInfos"
          style="width: 100%">
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <div class="box-card" shadow="never" v-if="state_click[props.$index] == 1">
                <researcherCard :author="props.row" :index="props.$index" :list="listPertinence" v-on:close="deleteRow(props.$index, tableData, props.row)" v-on:validate="validateRow(props.$index, tableData, props.row)"/>
              </div>
              <article v-if="state_click[props.$index] == 2">
                <strong>Contacts :</strong>
                <ul>
                  <li v-if="props.row.contact.length == 0">Unknown</li>
                  <li v-else v-for="contact in props.row.contact">
                    <span v-for="(v,i,count) in contact">{{i}} : {{v}}
                      <span v-show="count<(Object.keys(contact).length-1)">, </span>
                    </span>
                  </li>
                </ul>
              </article>
            </template>


          </el-table-column>

          <el-table-column
            label="Authors"
            :render-header="info_caption"
            width="280"
            fixed>
            <template slot-scope="props">
                <div v-if="props.row.verification == 2" class="line_verif c_green"></div>
                <div v-if="props.row.verification == 1" class="line_verif c_orange"></div>
                <div v-if="props.row.verification == 0" class="line_verif c_grey"></div>
                <strong class="align">{{ props.row.name}}</strong>
                <p v-if="props.row.id.length > 10">
                  <img src="../../../assets/images/logo-orcid.png" alt="logo orcid" class="little_icon">{{ props.row.id }}
                </p>
                <p v-else>
                  <img src="../../../assets/images/logo-semscho.png" alt="logo semantic scholar" class="little_icon">{{ props.row.id }}
                </p>
            </template>
          </el-table-column>

          <el-table-column
            label="Affiliation"
            prop="affiliation"
            width="220">
            <template slot-scope="props">
              <p v-if="props.row.affiliation.length == 0">Unknown</p>
              <p v-else>{{ props.row.affiliation }}</p>
              <p v-if="props.row.country != 'N/A'">({{ props.row.country[0] }})</p>
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="Score"
            prop="score"
            width="100">
            <template slot-scope="props">
              <p>{{ props.row.score }}</p>
              <p>Score (year) : {{ props.row.scorePond }}</p>
            </template>
          </el-table-column> -->

          <el-table-column
            label="Citations"
            prop="citations"
            width="100">
            <template slot-scope="props">
              <p>{{ props.row.citations }}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="Conflict of interest"
            prop="conflit">
            <template slot-scope="props">
                <div v-if="props.row.conflit == 0" class="round c_green"></div>
                <div v-else-if="props.row.conflit > 0 && props.row.conflit <= 1" class="round c_orange"></div>
                <div v-else-if="props.row.conflit > 1" class="round c_red"></div>
                <div v-else class="round c_grey"></div>
                <p v-if="props.row.conflit < 0" style="display:inline-block;">N/A</p>
                <p v-else style="display:inline-block;">{{ props.row.conflit }}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="Actions"
            width="160">
            <template slot-scope="scope">
              <el-popover
                ref="popdoc"
                placement="top"
                trigger="hover"
                content="Most pertinents works">
              </el-popover>
              <el-button
                type="primary"
                icon="el-icon-document"
                circle
                @click="displayInfosA(scope.$index, scope.row)"
                v-popover:popdoc>
              </el-button>
              <el-popover
                ref="popcon"
                placement="top"
                trigger="hover"
                content="Send a request">
              </el-popover>
              <el-button v-if="scope.row.contact.length > 0"
                type="success"
                icon="el-icon-message"
                circle
                @click="displayInfosB(scope.$index, scope.row)"
                v-popover:popcon>
              </el-button>
              <el-button v-else
                type="success"
                icon="el-icon-message"
                circle
                disabled>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    </div>
    <el-dialog
      title="Send a Request to Review"
      :visible.sync="centerDialogVisible"
      width="75%">
      <requestView v-if="centerDialogVisible" :formPost="formPost" :formMail='formMail' :rowInfos='rowInfos' v-on:close="centerDialogVisible = false"/>

    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import researcherCard from './researcher_card_test'
import requestView from './requestView'
export default {
  components: {researcherCard,requestView},
  data () {
    return {
      formMail: {
        object: '',
        mailDest: '',
        name: '',
        journal: '',
        message: '',
        deadline: '',
        relaunch: '2x1month',
        cgu:false
        // ,issn: ''
      },
      centerDialogVisible: false,
      state_click: [],
      isExpanded: [],
      progress_status: 0,
      progress_status_pdf: 0,
      formPost: {
        abstract: '',
        title: '',
        keywords: [],
        authors: [],
        listPertinence: {}
      },
      rules: {
        abstract: [
          {required: true, message: 'Please enter the abstract of the article', trigger: 'blur'}
        ],
        authors: [
          {required: true, message: 'Please enter at least the author of the article', trigger: 'blur'}
        ],
        title: [
          {required: true, message: 'Please enter the title of the article', trigger: 'blur'},
          {min: 3, message: 'Length should be at least 3', trigger: 'blur'}
        ]
      },
      tableData: [{}],
      isData: false,
      search: '',
      inputVisible: false,
      inputVisibleAut: false,
      inputValue: '',
      inputValueAut: '',
      load_var: false,
      id: '',
      rowInfos: {},
      requestInfos: {},
      activeNames: "",
      cats: [
        {
          value: "art_and_humanities",
          label: "Art and Humanities",
          disabled: false
        },
        {
          value: "biology",
          label: "Biology",
          disabled: false
        },
        {
          value: "business_and_economics",
          label: "Business and Economics",
          disabled: false
        },
        {
          value: "chemistry",
          label: "Chemistry",
          disabled: false
        },
        {
          value: "computer_science",
          label: "Computer Science",
          disabled: false
        },
        {
          value: "earth_and_planetary_sciences",
          label: "Earth and Planetary Sciences",
          disabled: false
        },
        {
          value: "engineering",
          label: "Engineering",
          disabled: false
        },
        {
          value: "environmental_science",
          label: "Environmental Science",
          disabled: false
        },
        {
          value: "health_profession",
          label: "Health Profession",
          disabled: false
        },
        {
          value: "materials_science",
          label: "Materials Science",
          disabled: false
        },
        {
          value: "mathematics",
          label: "Mathematics",
          disabled: false
        },
        {
          value: "medicine",
          label: "Medicine",
          disabled: false
        },
        {
          value: "neuroscience",
          label: "Neuroscience",
          disabled: false
        },
        {
          value: "nursing",
          label: "Nursing",
          disabled: false
        },
        {
          value: "physics",
          label: "Physics",
          disabled: false
        },
        {
          value: "psychology",
          label: "Psychology",
          disabled: false
        },
        {
          value: "sociology",
          label: "Sociology",
          disabled: false
        }
        // ,
        // {
        //   value: "multidisciplinary",
        //   label: "Multidisciplinary",
        //   disabled: false
        // }
      ],
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
      },
      subcats: [],
      seconds: 0,
      interId: 0,
      pdfInter: 0,
      fileList:[],
      progress_status_pdf: 0,
      dataUpload: false
    }
  },
  methods: {
    closeDialogBox (new_val) {
      this.centerDialogVisible = new_val
    },
    replaceChariot () {
      // console.log(this.formPost.abstract);
      let temp = this.formPost.abstract.replace(/\n|\r|(\n\r)/g,' ');
      this.formPost.abstract = temp
    },
    format(value){
      return value === 100 ? '50000000 articles browsed': `${value*500000} articles browsed`;
    },
    sendRequestRev(formMail){
      this.$refs[formMail].validate((valid) => {
        if (valid) {
          this.requestInfos["title"] = this.formPost["title"]
          this.requestInfos["abstract"] = this.formPost["abstract"]
          this.requestInfos["rev_id"] = this.rowInfos["id"]
          this.requestInfos["rev_name"] = this.rowInfos["name"]
          this.requestInfos["deadline"] = this.formMail["deadline"]
          this.requestInfos["pub_mail"] = this.formMail["mailDest"]
          this.requestInfos["pub_journal"] = this.formMail["journal"]
          this.requestInfos["pub_name"] = this.formMail["name"]

          new Promise ((resolve,reject) => {
            axios.get('https://service.publifactory.co/api/get_mail_id?id=' + this.requestInfos.rev_id)
            .then( async (res) => {
              if (res) {
                this.requestInfos["rev_mail"] = res['data'][0]["_source"]["mail"]
              }
              else {
                this.requestInfos["rev_mail"] = ""
              }
              this.centerDialogVisible = false;
              console.log(this.requestInfos);
            })
          })
        }
      })
    },
    info_caption(h, { column, $index }) {
      return h("span", [
        column.label,
        " ",
        h(
          "el-popover",
          {
            props: {
              title: "Caption",
              // width: "200",
              trigger: "hover"
              }
          },
          [
              h("p", [
                h("span", {style: "color:#30B08F;"}, "Green"),
                " : The author is referenced in ORCID"
              ]),
              h("p", [
                h("span", {style: "color:orange;"}, "Orange"),
                " : The author is referenced in ORCID but can have namesake problem"
              ]),
              h("p", [
                h("span", {style: "color:#A5A9AD;"}, "Grey"),
                " : The author isn't referenced in ORCID"
              ]),
              h(
                  "i",
                  {
                    slot: "reference",
                    class: "el-icon-info"
                  },
                  ""
                )
          ]
        )
      ])
    },

    info_caption_coi(h, { column, $index }) {
      return h("span", [
        column.label,
        " ",
        h(
          "el-popover",
          {
            props: {
              trigger: "hover"
              }
          },
          [
              h("p", " Conflict of Interest"),
              h(
                  "i",
                  {
                    slot: "reference",
                    class: "el-icon-info"
                  },
                  ""
                )
          ]
        )
      ])
    },

    uploadChange(file, fileList){
      this.fileList = fileList.slice(-1);
    },
    uploadSectionFile(param){
      this.progress_status_pdf = 0
      this.pdfInter = window.setInterval(()=>{
        if (this.progress_status_pdf<100)
          this.progress_status_pdf = this.progress_status_pdf +1
      }, 500);
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("pdf_file", fileObject);
      let res = ''

      new Promise ((resolve,reject) => {
        axios.post('https://service.publifactory.co/api/extract_infos_pdf', formData, { headers: { 'Content-Type': 'multipart/form-data',"Accept": 'application/json', } })
        .then( async (id) => {
            console.log(id);
            resolve(res = await axios.get('https://service.publifactory.co/api/results_pdf/' + id.data))
            console.log(res.data[0])
            this.formPost.abstract = res.data[0].abstract
            this.formPost.title = res.data[0].title
            this.formPost.keywords = res.data[0].keywords
            this.formPost.authors = res.data[0].authors
            this.progress_status_pdf = 100
            this.dataUpload = true
        })
      })
    },

    exportListJson() {
      let dataStr = JSON.stringify(this.tableData);
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      let exportFileDefaultName = 'list_reviewer.json';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },

    exportListCsv() {
      if(this.tableData.length == 0) {
        return '';
      }

      let keys = Object.keys(this.tableData[0]);

      let columnDelimiter = ',';
      let lineDelimiter = '\n';

      let csvColumnHeader = keys.join(columnDelimiter);
      let csvStr = csvColumnHeader + lineDelimiter;

      this.tableData.forEach(item => {
          keys.forEach((key, index) => {
              if( (index > 0) && (index < keys.length-1) ) {
                  csvStr += columnDelimiter;
              }
              csvStr += item[key];
          });
          csvStr += lineDelimiter;
      });

      csvStr = encodeURIComponent(csvStr);
      let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;

      let exportFileDefaultName = 'list_reviewer.csv';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },

    handleClose(tag) {
      this.formPost.keywords.splice(this.formPost.keywords.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formPost.keywords.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    //Ajout authors
    handleCloseAut(aut) {
      this.formPost.authors.splice(this.formPost.authors.indexOf(aut), 1);
    },
    showInputAut() {
      this.inputVisibleAut = true;
      this.$nextTick(_ => {
        this.$refs.saveAutInput.$refs.input.focus();
      });
    },
    handleInputConfirmAut() {
      let inputValueAut = this.inputValueAut;
      if (inputValueAut) {
        if (inputValueAut.includes(",")) {
          let temp = inputValueAut.split(",")
          for (let x=0; x<temp.length; x++) {
            this.formPost.authors.push(temp[x]);
          }
        }
        else if (inputValueAut.includes("/")) {
          let temp = inputValueAut.split("/")
          for (let x=0; x<temp.length; x++) {
            this.formPost.authors.push(temp[x]);
          }
        }
        else if (inputValueAut.includes("|")) {
          let temp = inputValueAut.split("|")
          for (let x=0; x<temp.length; x++) {
            this.formPost.authors.push(temp[x]);
          }
        }
        else if (inputValueAut.includes(";")) {
          let temp = inputValueAut.split(";")
          for (let x=0; x<temp.length; x++) {
            this.formPost.authors.push(temp[x]);
          }
        }
        else {
          this.formPost.authors.push(inputValueAut);
        }
      }
      this.inputVisibleAut = false;
      this.inputValueAut = '';
    },

    uploadSectionFile(param){
      this.progress_status_pdf = 0
      window.setInterval(()=>{
        if (this.progress_status_pdf<100)
          this.progress_status_pdf = this.progress_status_pdf +1
      }, 500);
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("pdf_file", fileObject);
      let res = ''
      new Promise ((resolve,reject) => {
        axios.post('https://service.publifactory.co/api/extract_infos_pdf', formData, { headers: { 'Content-Type': 'multipart/form-data',"Accept": 'application/json', } })
        .then( async (id) => {
            console.log(id);
            resolve(res = await axios.get('https://service.publifactory.co/api/results_pdf/' + id.data))
            console.log(res.data[0])
            this.formPost.abstract = res.data[0].abstract
            this.formPost.title = res.data[0].title
            this.formPost.keywords = res.data[0].keywords
            this.formPost.authors = res.data[0].authors
            this.progress_status_pdf = 100
        })
      //axios.get('http://35.241.170.253:5000/api/extract_infos_pdf?pdf_file='+fileObj.buffer).then((res)=>console.log("uploadSectionFile :: " , res))
      })
    },

    async onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("onSubmit :: start");
          this.load_var = true
          this.isData = false
          this.progress_status = 0
          window.setInterval(()=>{
            if (this.progress_status<100)
              this.progress_status = this.progress_status +1
          }, 250);
          this.formPost.abstract = this.formPost.abstract.replace('&',' ');
          this.formPost.abstract = this.formPost.abstract.replace('/',' ');
          let res = ''
          this.updateMetrics(this.formPost.fields,this.formPost.title)
          new Promise ((resolve,reject) => {
            axios.get('https://service.publifactory.co/api/request_reviewer?abstract=' + this.formPost.abstract + '&authors=' + this.formPost.authors)//+ '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
            .then( async (id) => {
                console.log(id);

                resolve(res = await axios.get('https://service.publifactory.co/api/results_rev/' + id.data))
                console.log("onSubmit :: " , res)
                this.progress_status = 100
                this.tableData = res.data
                this.isData = true
                this.state_click = []
                this.isExpanded = []
                this.listPertinence = {"abstract": this.formPost.abstract, "nb_suggestion": res.data.length, "ratio": 0, "list_failed": []}
                console.log(this.listPertinence);
                var anchor = document.querySelector("#scroll_anchor");
                //var anchor = this.$refs.refTable;
                const sleep = (milliseconds) => {
                  return new Promise(resolve => setTimeout(resolve, milliseconds))
                };
                sleep(100).then(() => {
                  anchor.scrollIntoView({ behavior: 'smooth', block: 'start'});
                })
                this.load_var = false
              }
            )
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    send_list_pertinence() {
      // this.listPertinence.ratio = this.listPertinence.list_failed.length / this.listPertinence.nb_suggestion
      // console.log("before", this.listPertinence);
      // let temp = JSON.stringify(this.listPertinence)
      // let today = new Date();
      // let token = this.formPost.title.replace(/\s/g, '').substring(0, 3) + today.getDate() + today.getMonth() + today.getFullYear() + this.formPost.title.replace(/\s/g, '').substr(this.formPost.title.length - 3)
      // console.log(token);
      // new Promise ((resolve,reject) => {
      //   axios.get('http://localhost:5000/api/add_list_pertinence?data=' + temp + '&token=' + token)
      //   .then( async (res) => {
      //     console.log("after", res.data);
      //   })
      // })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.subcats = [];
      this.cats.forEach(function(cat){
        cat.disabled = false
      });
      this.load_var = false
      this.isLoading = false
      clearInterval(this.interId)
      clearInterval(this.pdfInter)
      this.dataUpload = false
      this.progress_status_pdf = 0
      this.fileList = []
      cancel()
    },

    displayInfos(row) {
      let index = parseInt(this.tableData.indexOf(row))
      // console.log("displayInfosB :: ", this.isExpanded[index], this.state_click[index])

      this.$refs.refTable.toggleRowExpansion(row)
      if(this.isExpanded[index] === true && this.state_click[index] == 0){
        this.isExpanded[index] = false;
        this.state_click[index] = 0;
      }
      else if(this.isExpanded[index] === false || this.isExpanded[index] == null){
        this.isExpanded[index] = true;
        this.state_click[index] = 1;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 1) {
        this.isExpanded[index] = false;
        this.state_click[index] = 0;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 2) {
        this.isExpanded[index] = true;
        this.state_click[index] = 1;
        this.$refs.refTable.toggleRowExpansion(row);
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 3) {
        this.isExpanded[index] = true;
        this.state_click[index] = 2;
        this.$refs.refTable.toggleRowExpansion(row);
      }
    },

    displayInfosA(index, row) {
      // console.log("index: ", this.isExpanded[index], this.state_click[index]);
    },

    displayInfosB(index, row) {
      this.rowInfos = {'row': row, 'id': row["original_id"], 'name': row["name"]}
      this.formMail.object = 'Request to review - ' + this.formPost.title + ' - Publifactory'
      this.formMail.cgu = false
      this.formMail.message = 'Dear Dr ' + this.rowInfos.name + '\r\n\r\nI would like to invite you to review the article \"' + this.formPost.title + '\" \r\n\r\nAbstract : ' + this.formPost.abstract

      // console.log("displayInfosB :: ", this.isExpanded[index], this.state_click[index])
      this.$refs.refTable.toggleRowExpansion(row);
      this.centerDialogVisible = true
      if(this.isExpanded[index] === false || this.isExpanded[index] == null){
        this.isExpanded[index] = true;
        this.state_click[index] = 3;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 2) {
        this.$refs.refTable.toggleRowExpansion(row);
        this.isExpanded[index] = true;
        this.state_click[index] = 0;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 1) {
        this.isExpanded[index] = true;
        this.state_click[index] = 3;
        this.$refs.refTable.toggleRowExpansion(row);
      }
    },
    deleteRow(index, rows, row) {
      this.$refs.refTable.toggleRowExpansion(row);
      this.isExpanded[index] = false;
      this.state_click[index] = 0;

      this.listPertinence.list_failed[index] = {"title": row.article[0].title, "abstract": row.article[0].abstract};
      console.log(row);

      this.listPertinence.ratio = this.listPertinence.list_failed.length / this.listPertinence.nb_suggestion
      console.log("before", this.listPertinence);
      let temp = JSON.stringify(this.listPertinence)
      let today = new Date();
      let token = this.formPost.title.replace(/\s/g, '').substring(0, 3) + today.getDate() + today.getMonth() + today.getFullYear() + this.formPost.title.replace(/\s/g, '').substr(this.formPost.title.length - 3)
      console.log(token);
      new Promise ((resolve,reject) => {
        axios.get('https://service.publifactory.co/api/add_list_pertinence?data=' + temp + '&token=' + token)
        .then( async (res) => {
          console.log("after", res.data);
        })
      })
    },
    validateRow(index, rows, row) {
      if (typeof this.listPertinence.list_failed[index] != 'undefined'){
        this.$refs.refTable.toggleRowExpansion(row);
        this.isExpanded[index] = false;
        this.state_click[index] = 0;

        this.listPertinence.list_failed.splice(index, 1);

        this.listPertinence.ratio = this.listPertinence.list_failed.length / this.listPertinence.nb_suggestion
        console.log("before", this.listPertinence);
        let temp = JSON.stringify(this.listPertinence)
        let today = new Date();
        let token = this.formPost.title.replace(/\s/g, '').substring(0, 3) + today.getDate() + today.getMonth() + today.getFullYear() + this.formPost.title.replace(/\s/g, '').substr(this.formPost.title.length - 3)
        console.log(token);
        new Promise ((resolve,reject) => {
          axios.get('https://service.publifactory.co/api/add_list_pertinence?data=' + temp + '&token=' + token)
          .then( async (res) => {
            console.log("after", res.data);
          })
        })
      } else {
        this.$refs.refTable.toggleRowExpansion(row);
        this.isExpanded[index] = false;
        this.state_click[index] = 0;
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleChange(){
      console.log('yay');
    }
  }
}
</script>
<style>

.bandeau {
  position: fixed;
  top: 30px;
  right: -45px;
  background-color: #E6A23C;
  color: white;
  padding: 0px 40px;
  transform: rotate(45deg);
  font-weight: bold;
  z-index: 1000;
}

.app-container {
  max-width: 1140px;
  padding: 0px 20px;
  margin: 0 auto;
}
.head{
  text-align: center;

}
.head h2 {
  font-family: 'DNLTPro-light-italic';
  font-size: 1.3em;

}
h1 {
  font-family: 'DNLTPro-bold';
  text-align: center;
}

h2 {
  font-family: 'DNLTPro-bold';
}

p {
  font-family: 'DNLTPro-regular';
}

strong {
  display: block;
  margin-top: 5px;
}
.el-collapse-item{
  padding-bottom: 20px;
}
.el-collapse-item__header{
  font-family: 'DNLTPro-regular';
  background-color: #f4f4f4;
  font-size: 1.5em;
  font-weight: 800;

}
.el-collapse-item__wrap{
  background-color: #f4f4f4;

}
.el-collapse-item__content{
  font-family: 'DNLTPro-regular';
  font-size: 1rem;
  background-color: #f4f4f4;
}
.el-collapse {
    border-top: 1px solid #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
}
.description-container {
  background-color: #f4f4f4;
  margin-bottom: 30px;
  border-radius:10px;
}
.description {
  padding: 50px;
  margin-top: 30px;
}
.description > p {
    margin: 0;
}

#scroll_anchor {
  border-top: 1px solid lightgray;
}

.el-tag  {
    margin-right: 10px
  }
.el-tag + .el-tag {
    margin-right: 10px
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

/* .el-icon-arrow-right:before {
  content:"";
  display: none;
} */

  .el-table__expand-icon {
    display: none;
  }

.align {
  display: inline-block;
}

.flex_items > .el-form-item__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress_bar {
  width: 100%;
  margin: 0 20px;
}

.little_icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}


.el-table__row td:nth-child(2) {
  padding: 0;
  text-align: center;
}
  .el-table__row td:nth-child(2) > .cell {
    position: relative;
    padding: 0 20px;
  }
    .line_verif {
      position: absolute;
      top: 5%;
      left: 0;
      width: 3px;
      height: 90%;
    }
    .c_green {
      background-color: #30B08F;
    }

    .c_orange {
      background-color: orange;
    }

    .c_grey {
      background-color: #A5A9AD;
    }

    .c_red {
      background-color: #F56C6C;
    }

.round {
  width: 13px;
  height: 13px;
  border-radius: 100px;
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
}

.el-table__row td:nth-child(3), .el-table__row td:nth-child(4), .el-table__row td:nth-child(5), .el-table__row td:nth-child(6) {
  text-align: center;
}

.el-upload {
  width: 100%;
}
  .el-upload-dragger {
    width: 100%;
    height: 160px;
  }

.el-form-item__label {
  text-align: left;
}

.input-new-tag {
  height: 100%;
  margin: 0;
}

.el-table__expanded-cell[class*=cell] {
  padding: 20px!important;
}
  .el-table__expanded-cell[class*=cell] > article {
    padding-left: 30px;
    border-left: 1px solid lightgrey;
  }

.el-progress-bar__outer, .el-progress-bar__inner {
  border-radius: 4px;
}

.el-table .cell {
  padding: 0 20px!important;
}

.el-upload-dragger .el-icon-upload {
  margin: 16px 0;
}

@media (max-width: 1280px) {
  .app-container {
    max-width: 1020px;
  }

  .el-col-1 {
    padding: 0!important;
  }
}

@media (max-width: 1024px) {
  .button_tab {
    padding: 5px 7px;
  }
}

</style>
