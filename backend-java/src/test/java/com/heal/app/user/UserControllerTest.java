package com.heal.app.user;

import com.heal.app.user.internal.UserService;
import com.heal.app.user.internal.model.User;
import com.heal.app.user.internal.model.UserProfile;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnLandingSummary() throws Exception {
        // Given
        User mockUser = new User();
        mockUser.setUser_id("usr_100");
        mockUser.setProfile(new UserProfile("Priya"));
        
        when(userService.getUserLandingData("usr_100")).thenReturn(mockUser);

        // When & Then
        mockMvc.perform(get("/v1/me/landing").param("userId", "usr_100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.name").value("Priya"));
    }

    @Test
    void shouldReturn404WhenUserNotFound() throws Exception {
        // Given
        when(userService.getUserLandingData(anyString())).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/v1/me/landing").param("userId", "nonexistent"))
                .andExpect(status().isNotFound());
    }
}
