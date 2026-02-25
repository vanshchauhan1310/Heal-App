package com.heal.app;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

class ModulithTest {

    @Test
    void verifyModules() {
        ApplicationModules modules = ApplicationModules.of(HealBackendApplication.class);
        modules.verify();
        
        // This will generate documentation in target/spring-modulith-docs
        new Documenter(modules).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
    }
}
