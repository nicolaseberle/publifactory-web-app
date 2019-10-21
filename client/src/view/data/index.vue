<template>
    <div class="datasets__list-wrapper">
      <div class='datasets__list-col'>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Public dataset" name="first"></el-tab-pane>
        <ul>
          <li class='sc-fdQOMr sc-dTsoBL cHKWSd sc-bEufUU card-element-list'>
            <a href="/dgomonov/new-york-city-airbnb-open-data" title="New York City Airbnb Open Data" class="sc-gFXMyG li-link"></a>
            <div class='sc-gQNndl  card-element'>
              <img src="https://storage.googleapis.com/kaggle-datasets-images/268833/559075/cf825b5af1f904cd1ea6404039abc88e/dataset-thumbnail.jpg?t=2019-07-18-19-19-53" alt="#" class="sc-RmnOB bQsmQD">
              <div class="sc-cNnxps eqmlAr"><h3 data-testid="list-item-li-title" class="sc-jPPmml card-title">New York City Airbnb Open Data</h3>

                <div class="sc-bJTOcE card-author"><a href="/dgomonov" class="sc-dPNhBE card-author-link"><span class="sc-kkwfeq sc-izvnbC iaQecT sc-imDfJI dmMCtO"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z">

                </path></svg>N.Eberle, M.Rera</span></a></div><div class="sc-PLyBE hCVphz"><span class="sc-kkwfeq beznft sc-imDfJI dmMCtO"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>a month</span><span class="sc-kkwfeq sc-gMcBNU csvFSu sc-imDfJI dmMCtO">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="database" class="svg-inline--fa fa-database fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">

                  <path fill="currentColor" d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z">
                  </path></svg>5 MB</span>
                  <div class="sc-iLVFha gEYclW sc-jzgbtB dDMElN" data-tip="true" data-for="tooltip_components_0" currentitem="false">
                    <span class="sc-DNdyV thGX sc-imDfJI dmMCtO">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="toolbox" class="svg-inline--fa fa-toolbox fa-w-16 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M502.63 214.63l-45.25-45.25c-6-6-14.14-9.37-22.63-9.37H384V80c0-26.51-21.49-48-48-48H176c-26.51 0-48 21.49-48 48v80H77.25c-8.49 0-16.62 3.37-22.63 9.37L9.37 214.63c-6 6-9.37 14.14-9.37 22.63V320h128v-16c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v16h128v-16c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v16h128v-82.75c0-8.48-3.37-16.62-9.37-22.62zM320 160H192V96h128v64zm64 208c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-16H192v16c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-16H0v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96H384v16z">
                  </path>
                  </svg>10.0
                </span>

                </div>
                <span class="sc-dYzWWc bvtnpv sc-imDfJI dmMCtO">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file" class="svg-inline--fa fa-file fa-w-12 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                  </svg>2 Files (other, CSV)
                </span>
                <span class="sc-cbMPqi lapWJn">319 upvotes</span></div>
                </div>
            </div>
          </li>
          <li class='sc-fdQOMr sc-dTsoBL cHKWSd sc-bEufUU card-element-list'>
            <a href="/dgomonov/new-york-city-airbnb-open-data" title="Mount Rainier Weather and Climbing Data" class="sc-gFXMyG li-link"></a>
            <div class='sc-gQNndl  card-element'>
              <img src="https://storage.googleapis.com/kaggle-datasets-images/293945/602740/dcc4f2a921fe379a6de2bcd92336e4dc/dataset-thumbnail.jpg?t=2019-08-08-18-20-03" alt="#" class="sc-RmnOB bQsmQD">
              <div class="sc-cNnxps eqmlAr"><h3 data-testid="list-item-li-title" class="sc-jPPmml card-title">Mount Rainier Weather and Climbing Data</h3>

                <div class="sc-bJTOcE card-author"><a href="/dgomonov" class="sc-dPNhBE card-author-link"><span class="sc-kkwfeq sc-izvnbC iaQecT sc-imDfJI dmMCtO"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z">

                </path></svg>N.Eberle, M.Rera</span></a></div><div class="sc-PLyBE hCVphz"><span class="sc-kkwfeq beznft sc-imDfJI dmMCtO"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>a month</span><span class="sc-kkwfeq sc-gMcBNU csvFSu sc-imDfJI dmMCtO">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="database" class="svg-inline--fa fa-database fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">

                  <path fill="currentColor" d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z">
                  </path></svg>4.4 MB</span>
                  <div class="sc-iLVFha gEYclW sc-jzgbtB dDMElN" data-tip="true" data-for="tooltip_components_0" currentitem="false">
                    <span class="sc-DNdyV thGX sc-imDfJI dmMCtO">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="toolbox" class="svg-inline--fa fa-toolbox fa-w-16 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M502.63 214.63l-45.25-45.25c-6-6-14.14-9.37-22.63-9.37H384V80c0-26.51-21.49-48-48-48H176c-26.51 0-48 21.49-48 48v80H77.25c-8.49 0-16.62 3.37-22.63 9.37L9.37 214.63c-6 6-9.37 14.14-9.37 22.63V320h128v-16c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v16h128v-16c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v16h128v-82.75c0-8.48-3.37-16.62-9.37-22.62zM320 160H192V96h128v64zm64 208c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-16H192v16c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-16H0v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96H384v16z">
                  </path>
                </svg>9.3
                </span>

                </div>
                <span class="sc-dYzWWc bvtnpv sc-imDfJI dmMCtO">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file" class="svg-inline--fa fa-file fa-w-12 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                  </svg>10 Files (other, CSV)
                </span>
                <span class="sc-cbMPqi lapWJn">319 upvotes</span></div>
                </div>
            </div>
          </li>
          <li class='sc-fdQOMr sc-dTsoBL cHKWSd sc-bEufUU card-element-list'>
            <a href="/dgomonov/new-york-city-airbnb-open-data" title="Waves Measuring Buoys Data" class="sc-gFXMyG li-link"></a>
            <div class='sc-gQNndl  card-element'>
              <img src='https://storage.googleapis.com/kaggle-datasets-images/256873/539478/24321f40c6acb5b543c1802f0fc9ccc8/dataset-thumbnail.jpg?t=2019-07-07-17-08-29' alt="#" class="sc-RmnOB bQsmQD">
              <div class="sc-cNnxps eqmlAr"><h3 data-testid="list-item-li-title" class="sc-jPPmml card-title">Waves Measuring Buoys Data </h3>

                <div class="sc-bJTOcE card-author"><a href="/dgomonov" class="sc-dPNhBE card-author-link"><span class="sc-kkwfeq sc-izvnbC iaQecT sc-imDfJI dmMCtO"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z">

                </path></svg>L.Riberon, V.Schuck</span></a></div><div class="sc-PLyBE hCVphz"><span class="sc-kkwfeq beznft sc-imDfJI dmMCtO"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>a month</span><span class="sc-kkwfeq sc-gMcBNU csvFSu sc-imDfJI dmMCtO">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="database" class="svg-inline--fa fa-database fa-w-14 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">

                  <path fill="currentColor" d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z"></path></svg>2 MB</span><div class="sc-iLVFha gEYclW sc-jzgbtB dDMElN" data-tip="true" data-for="tooltip_components_0" currentitem="false">
                    <span class="sc-DNdyV thGX sc-imDfJI dmMCtO">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="toolbox" class="svg-inline--fa fa-toolbox fa-w-16 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M502.63 214.63l-45.25-45.25c-6-6-14.14-9.37-22.63-9.37H384V80c0-26.51-21.49-48-48-48H176c-26.51 0-48 21.49-48 48v80H77.25c-8.49 0-16.62 3.37-22.63 9.37L9.37 214.63c-6 6-9.37 14.14-9.37 22.63V320h128v-16c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v16h128v-16c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v16h128v-82.75c0-8.48-3.37-16.62-9.37-22.62zM320 160H192V96h128v64zm64 208c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-16H192v16c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-16H0v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96H384v16z">
                  </path>
                </svg>8.0
                </span>

                </div>
                <span class="sc-dYzWWc bvtnpv sc-imDfJI dmMCtO">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file" class="svg-inline--fa fa-file fa-w-12 sc-hAnkBK cWVWbh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                  </svg>2 Files (other, CSV)
                </span>
                <span class="sc-cbMPqi lapWJn">319 upvotes</span></div>
                </div>
            </div>
          </li>
        </ul>
        </el-tabs>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'first'};
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
<style>
.datasets__list-wrapper {
    box-sizing: border-box;
    margin: 32px auto 0;
    max-width: 950px;
    width: 100%;
}
.datasets__list-col {
    display: flex;
    flex-direction: column;
    font-size: 12px;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
}
li {
    text-align: -webkit-match-parent;
}
.cHKWSd {
    border-bottom: none;
}
.card-element-list {
    box-sizing: border-box;
    list-style-type: none;
    background-color: rgb(255, 255, 255);
    position: relative;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(235, 236, 236);
    border-image: initial;
    padding: 12px;
}
.li-link {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
.card-element {
    display: flex;
    min-width: 0px;
    flex: 1 1 0px;
}
.bQsmQD {
    width: 64px;
    height: 64px;
    margin-right: 12px;
    border-radius: 4px;
}
.eqmlAr {
    min-width: 0px;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex: 1 1 0px;
}
.card-title {
    font-size: 1.2em;
    font-weight: 500;
    color: rgb(0, 0, 0);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
}
.card-author {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}
.card-author-link {
    position: relative;
    z-index: 2;
    text-decoration: none;
}
.iaQecT {
    margin-right: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.dmMCtO {
    color: rgba(0, 0, 0, 0.4);
}
svg:not(:root).svg-inline--fa {
    overflow: visible;
}
.svg-inline--fa.fa-w-14 {
    width: 0.875em;
}
.cWVWbh {
    margin-right: 6px;
}
.svg-inline--fa {
    display: inline-block;
    font-size: inherit;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
}
.hCVphz {
    display: grid;
    -webkit-box-align: center;
    align-items: center;
    grid-template-columns: minmax(85px, max-content) minmax(75px, max-content) max-content 1fr;
}
.beznft {
    margin-right: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.dmMCtO {
    color: rgba(0, 0, 0, 0.4);
}
.csvFSu {
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 18px;
    overflow: hidden;
}
.dmMCtO {
    color: rgba(0, 0, 0, 0.4);
}
.gEYclW {
    margin-right: 18px;
    z-index: 2;
    position: relative;
}
.dDMElN {
    font-family: "Atlas Grotesk", sans-serif;
    display: inline-flex;
}
.bvtnpv {
    margin-right: 18px;
}
.dmMCtO {
    color: rgba(0, 0, 0, 0.4);
}
@media screen and (min-width: 768px){
  .lapWJn {
      display: none;
  }
}
.lapWJn {
    color: rgba(0, 0, 0, 0.4);
    margin-right: 18px;
}
.cdMtLu {
    display: flex;
    height: 24px;
}
.fqmrri {
    display: flex;
    height: 24px;
    width: 88px;
}
h3 {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
</style>
