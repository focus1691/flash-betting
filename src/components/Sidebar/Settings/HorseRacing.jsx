import React, { useState } from 'react';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setItem } from '../../../localStorage/settings';
//* Custom @material-ui components
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';

export default ({ horseRaces, toggleHorseRaces, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
        onClick={() => {
          setChangeMade(false);
          setItem('horseRaces', horseRaces);
        }}
      >
        <img alt="Save" src={`${window.location.origin}/icons/Save_Button.svg`} />
      </button>
    );
  };

  return (
    <SectionBar>
      <SectionContent>
        <AppBar className={classes.appBar} position="absolute">
          <Typography variant="h6" className={classes.title}>
            Horse Racing
          </Typography>
        </AppBar>
      </SectionContent>
      {renderSaveBtn()}
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.GB}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: !horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="UK Races"
      />
      <br />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.IE}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: !horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="Irish Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.FR}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: !horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="French Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.DE}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: !horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="German Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.IT}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: !horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="Italian Races"
      />
      <br />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.AE}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: !horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="UAE Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.TR}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: !horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="Turkish Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.SG}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: !horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="Singaporean Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.SE}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: !horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="Swedish Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.US}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: !horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="USA Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.AU}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: !horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="Australian Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.NZ}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: !horseRaces.NZ,
                ZA: horseRaces.ZA,
              });
            }}
          />
        )}
        label="New Zealand Races"
      />
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={horseRaces.ZA}
            onChange={() => {
              setChangeMade(true);
              toggleHorseRaces({
                GB: horseRaces.GB,
                IE: horseRaces.IE,
                FR: horseRaces.FR,
                DE: horseRaces.DE,
                IT: horseRaces.IT,
                AE: horseRaces.AE,
                TR: horseRaces.TR,
                SG: horseRaces.SG,
                SE: horseRaces.SE,
                US: horseRaces.US,
                AU: horseRaces.AU,
                NZ: horseRaces.NZ,
                ZA: !horseRaces.ZA,
              });
            }}
          />
        )}
        label="South African Races"
      />
    </SectionBar>
  );
};
