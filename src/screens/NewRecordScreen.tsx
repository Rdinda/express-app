import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';

const NewRecordScreen = () => {
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [client, setClient] = useState('');
  const [technician, setTechnician] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [observations, setObservations] = useState('');

  // Error states
  const [vehiclePlateError, setVehiclePlateError] = useState('');
  const [clientError, setClientError] = useState('');
  const [maintenanceDateError, setMaintenanceDateError] = useState('');
  const [serviceDescriptionError, setServiceDescriptionError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    // Reset errors
    setVehiclePlateError('');
    setClientError('');
    setMaintenanceDateError('');
    setServiceDescriptionError('');

    if (!vehiclePlate.trim()) {
      setVehiclePlateError('Placa do Veículo é obrigatória.');
      isValid = false;
    }
    // Basic plate format check (optional, can be expanded)
    // else if (!/^[A-Z]{3}-?\d{4}$/i.test(vehiclePlate) && !/^[A-Z]{3}\d[A-Z]\d{2}$/i.test(vehiclePlate)) {
    //   setVehiclePlateError('Formato de placa inválido.');
    //   isValid = false;
    // }

    if (!client.trim()) {
      setClientError('Cliente é obrigatório.');
      isValid = false;
    }

    if (!maintenanceDate.trim()) {
      setMaintenanceDateError('Data da Manutenção é obrigatória.');
      isValid = false;
    }
    // Basic date format check (optional, can be expanded)
    // else if (!/^\d{4}-\d{2}-\d{2}$/.test(maintenanceDate)) {
    //   setMaintenanceDateError('Formato de data inválido (YYYY-MM-DD).');
    //   isValid = false;
    // }


    if (!serviceDescription.trim()) {
      setServiceDescriptionError('Descrição do Serviço é obrigatória.');
      isValid = false;
    }

    return isValid;
  };

  const handleSaveRecord = () => {
    if (validate()) {
      const formData = {
        vehiclePlate,
        client,
        technician,
        maintenanceDate,
        serviceDescription,
        partsUsed,
        observations,
      };
      console.log('Form is valid:', formData);
      // Placeholder for actual save logic (e.g., API call)
    } else {
      console.log('Form validation failed.');
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled" // Good for ScrollView with inputs
    >
      <Text style={styles.title}>Novo Registro de Manutenção</Text>
      
      <View>
        <TextInput
          label="Placa do Veículo"
          value={vehiclePlate}
          onChangeText={text => { setVehiclePlate(text); if(vehiclePlateError) validate(); }}
          style={styles.input}
          mode="outlined"
          error={!!vehiclePlateError}
        />
        <HelperText type="error" visible={!!vehiclePlateError}>
          {vehiclePlateError}
        </HelperText>
      </View>

      <View>
        <TextInput
          label="Cliente"
          value={client}
          onChangeText={text => { setClient(text); if(clientError) validate(); }}
          style={styles.input}
          mode="outlined"
          error={!!clientError}
        />
        <HelperText type="error" visible={!!clientError}>
          {clientError}
        </HelperText>
      </View>

      <TextInput // Technician is not required based on prompt
        label="Técnico Responsável"
        value={technician}
        onChangeText={setTechnician}
        style={styles.input}
        mode="outlined"
      />

      <View>
        <TextInput
          label="Data da Manutenção"
          value={maintenanceDate}
          onChangeText={text => { setMaintenanceDate(text); if(maintenanceDateError) validate(); }}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          error={!!maintenanceDateError}
        />
        <HelperText type="error" visible={!!maintenanceDateError}>
          {maintenanceDateError}
        </HelperText>
      </View>

      <View>
        <TextInput
          label="Descrição do Serviço"
          value={serviceDescription}
          onChangeText={text => { setServiceDescription(text); if(serviceDescriptionError) validate(); }}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!serviceDescriptionError}
        />
        <HelperText type="error" visible={!!serviceDescriptionError}>
          {serviceDescriptionError}
        </HelperText>
      </View>

      <TextInput // Parts used is not required based on prompt
        label="Peças Utilizadas"
        value={partsUsed}
        onChangeText={setPartsUsed}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />
      <TextInput // Observations is not required based on prompt
        label="Observações"
        value={observations}
        onChangeText={setObservations}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />
      <Button mode="contained" onPress={handleSaveRecord} style={styles.button}>
        Salvar Registro
      </Button>
      <View style={{ height: 40 }} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    // marginBottom: 16, // HelperText will provide some spacing
  },
  button: {
    marginTop: 16, // Increased margin top for button
    paddingVertical: 8,
  },
  // HelperText by default has its own margins, adjust if needed
});

export default NewRecordScreen;
